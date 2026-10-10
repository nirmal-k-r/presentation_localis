// pm2 start ecosystem.config.cjs            (port 3022)
// PORT=3200 pm2 start ecosystem.config.cjs  (another port; use the same one in the nginx proxy_pass)
module.exports = { apps: [{ name: 'pymug', script: 'server/server.mjs', cwd: __dirname, env: { PORT: process.env.PORT || 3022 } }] }
