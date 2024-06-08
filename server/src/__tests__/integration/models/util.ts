import TestAgent from 'supertest/lib/agent'
import Test from 'supertest/lib/test'

const { API_USER, API_PASS } = process.env

let access_token: string = ''

const login = async (agent: TestAgent) => {
  const auth_request = await agent
    .post('/login')
    .send({ username: API_USER, password: API_PASS })

  if (auth_request.status == 403) {
    console.error(auth_request.text)
    throw Error('Failed to login')
  }

  const json = await auth_request.body
  access_token = json.access_token
}

type Options = {
  method?: 'get' | 'post' | 'patch' | 'delete'
  body?: Record<string, any>
}
export const query = async (
  path: string,
  options: Options = {},
  agent: TestAgent,
  failed = false
): Promise<any> => {
  const { method, body } = options

  const agentWithAuthHeader = (test: Test) => {
    return test
      .set('API-Key', 'foobar')
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
  }

  try {
    const response =
      method === 'post'
        ? await agentWithAuthHeader(agent.post(path)).send(body)
        : method === 'delete'
        ? await agentWithAuthHeader(agent.delete(path))
        : await agentWithAuthHeader(agent.get(path))

    if (response.status == 422) throw Error(await response.text)

    if (response.status == 403 && !failed) {
      await login(agent)
      return query(path, options, agent, true)
    }

    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const jsonQuery = async (
  path: string,
  options: Options = {},
  agent: TestAgent,
  failed = false
): Promise<any> => {
  const response = await query(path, options, agent, failed)
  return response.body
}

export const config = {
  base_uri: process.env.API_BASE_URI,
  token: null,
}

export function debug(...args: any) {
  if (process.env.DEBUG === 'Y') {
    console.log(...args)
  }
}

export const yyyymmdd = function yyyymmdd(date: any) {
  let y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate()
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
}

export const make_queries = function make_queries(dict: any) {
  if (dict) {
    let query = Object.keys(dict)
      .map(k => `${k}=${dict[k]}`)
      .join('&')

    if (query) {
      return '?' + query
    }
  }

  return ''
}

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6?permalink_comment_id=3889214#gistcomment-3889214
export const merge = function merge(source: any, target: any) {
  for (const [key, val] of Object.entries(source)) {
    if (val !== null && typeof val === `object`) {
      // @ts-ignore
      target[key] ??= new val.__proto__.constructor()
      merge(val, target[key])
    } else {
      target[key] = val
    }
  }
  return target
}

var coverage_metrics: any = {}

export const coverage = {
  target: function (obj: any) {
    coverage_metrics = {}

    Object.keys(obj).forEach(o => {
      coverage_metrics[o] = {}
      obj[o].forEach((m: any) => {
        coverage_metrics[o][m] = 0
      })
    })
  },
  report: function () {
    let report = 'API coverage report:\n'
    Object.keys(coverage_metrics).forEach(k => {
      report += `\t${k}\n`
      Object.keys(coverage_metrics[k]).forEach(p => {
        let symbol = coverage_metrics[k][p] > 0 ? '✅' : '❌'
        report += `\t\t${symbol} ${p}\n`
      })
    })
    console.log(report)
  },
}

function count_coverage(path: any, opts: any = {}) {
  let method = opts.method ? opts.method.toUpperCase() : 'GET'
  if (!coverage_metrics[method]) {
    console.error(`No metric patterns for method ${opts.method}`)
    return
  }
  let patterns = Object.keys(coverage_metrics[method])
  for (const p of patterns) {
    const re = new RegExp(p)
    if (path.match(re)) {
      coverage_metrics[method][p]++
    }
  }
}
