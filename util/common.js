// common.js
// ========
module.exports = {
    getTheme: function (req) {
        var theme=""
        if (req.cookies.modelviewTheme == "united") theme = "united";
        if (req.cookies.modelviewTheme == "darkly") theme = "darkly";
        return theme;
    }
};