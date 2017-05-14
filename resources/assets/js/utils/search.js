module.exports = {
    addSearchListener: function () {
        document.getElementById("search-form").addEventListener('submit', function (e) {
            e.preventDefault(); // first statement
            var q = document.getElementById("search-bar").value;
            if(localStorage.getItem('org')) {
                window.location.href = "/o/"+localStorage.getItem('org') +"/search/"+ q;
            }else{
                window.location.href = "/login"
            }
        });
    }
};