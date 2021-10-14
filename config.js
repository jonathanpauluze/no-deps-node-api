const environments = {
  development: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'development',
  },

  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
  }
}

let currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : ''
let envToExport = environments[currentEnv] ? environments[currentEnv] : environments.development

export default envToExport
