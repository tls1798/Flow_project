var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http, { cors: { origin: "*" } });
const { Pool } = require('pg');

pg.connect(err => {
    if (err) console.log(err);
    else
        console.log("성공")
})

var port = 3000;
http.listen(port, () => {
    console.log("listening on *:" + port);
});

let memNo = 0;

io.on('connection', function (socket) {
    socket.on('memNo', function (num) {
        memNo = num;
    });
    
    //   setInterval(()=>{
    let bool = true;
    socket.on('test', function (data) {
        bool = data;

        if (bool) {
            pg.query("select n.nt_no, n.nt_type_no, nt_detail_no, n.mem_no, to_char(n.nt_datetime, 'YYYY-MM-DD HH24:MI') nt_datetime, n.rm_no, n.nt_temp,(select m.mem_name from \"Members\" m where m.mem_no = n.mem_no) as mem_name,(select r.rm_title from \"Rooms\" r where r.rm_no = n.rm_no) as rm_title,(select count(*) from notis n where n.mem_no != " + memNo + " and n.nt_temp -> '13' = 'null') , case when(nt_type_no=1) then (select ps.post_title from \"Posts\" ps where ps.post_no=n.nt_detail_no) when(nt_type_no=2) then (select cs.cm_content from \"Comments\" cs where cs.cm_no=n.nt_detail_no) else '' end as noti_content from notis n join (select * from \"Room_Members\" rm where rm.mem_no = " + memNo + ") as myRooms on myRooms.rm_no = n.rm_no where n.mem_no != " + memNo + " order by nt_datetime desc", (err, res) => {
                if (err != null)
                    console.log(err);

                socket.emit('data', res.rows)
                bool = false;
            })
        }
    })

    pg.query("select n.nt_no, n.nt_type_no, nt_detail_no, n.mem_no, to_char(n.nt_datetime, 'YYYY-MM-DD HH24:MI') nt_datetime, n.rm_no, n.nt_temp,(select m.mem_name from \"Members\" m where m.mem_no = n.mem_no) as mem_name,(select r.rm_title from \"Rooms\" r where r.rm_no = n.rm_no) as rm_title,(select count(*) from notis n where n.mem_no != " + memNo + " and n.nt_temp -> '13' = 'null') , case when(nt_type_no=1) then (select ps.post_title from \"Posts\" ps where ps.post_no=n.nt_detail_no) when(nt_type_no=2) then (select cs.cm_content from \"Comments\" cs where cs.cm_no=n.nt_detail_no) else '' end as noti_content from notis n join (select * from \"Room_Members\" rm where rm.mem_no = " + memNo + ") as myRooms on myRooms.rm_no = n.rm_no where n.mem_no != " + memNo + " order by nt_datetime desc", (err, res) => {
        if (err != null)
            console.log(err);
        console.log('갱신중')
        socket.emit('data', res.rows)
    })
    //   }, 1000)
})