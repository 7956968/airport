(function () {
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            columns1: [
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            data1: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ],
            "pageInfo": {
                "count": 100,
                "pageSize": 20,
                "pageNum": 0,
                "input": "",
                "select": "",
                "radio": "male",
                "checkbox": [],
                "switch": true,
                "date": "",
                "time": "",
                "slider": [20, 50],
                "textarea": ""
            },
            "windowHeight": window.innerHeight,
        },
        "methods": {
            "logout": function() {
                var self = this;
                window.location.href = "./login.html"
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
            },
        },
        "created": function () {
            var self = this;
        }
    });

}())
