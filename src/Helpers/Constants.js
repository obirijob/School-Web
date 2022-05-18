const moment = require("moment")

const backendUrl = "http://localhost:2000"
module.exports = {
  backendUrl,
  dataUrl: `${backendUrl}/graphQL`,
  toDateString(datestring, format) {
    return moment(parseInt(datestring)).format(format)
  },
}
