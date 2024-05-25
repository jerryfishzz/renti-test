const API_SCHEME = process.env.API_SCHEME || 'http'
const API_DOMAIN = process.env.API_DOMAIN || 'localhost:6666'

let access_token: any = null

// const login = async () => {
//   const auth_request = await fetch(`${API_SCHEME}://${API_DOMAIN}/${API_BASE_PATH}/login`, {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username: API_USER, password: API_PASS })
//   })
//   if (auth_request.status == 403) {
//     console.error(auth_request.text())
//     throw Error('Failed to login')
//   }
//   const json: any = await auth_request.json()
//   access_token = json.access_token
// }

export const query = async (
  path: string,
  options: RequestInit = {},
  failed = false
): Promise<any> => {
  // count_coverage(path, options)

  const response = await fetch(`${API_SCHEME}://${API_DOMAIN}${path}`, {
    ...options,
    headers: {
      ...(options?.headers || []),
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${access_token}`,
    },
  })

  // debug(
  //   `${
  //     options?.method || 'GET'
  //   } ${API_SCHEME}://${API_DOMAIN}/${API_BASE_PATH}${path}`
  // )

  if (response.status == 422) throw Error(await response.text())
  if (response.status == 403 && !failed) {
    // await login()
    return query(path, options, true)
  }
  if (!response.ok) {
    const error = await response.text()
    console.error(response.status, error)
    throw Error(error)
  }
  return response
}

export const jsonQuery = async (
  path: string,
  options: RequestInit = {},
  failed = false
): Promise<any> => {
  const response = await query(path, options, failed)
  return await response.json()
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
