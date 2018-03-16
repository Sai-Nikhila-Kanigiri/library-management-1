const express = require('express')
var mysql= require('mysql');
var bodyparser = require('body-parser'); 



const app = express()
app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs');
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
app.get('/home', function (req, res) {

  res.sendFile(__dirname+'/public/home.html')
})

var connection;
connection=mysql.createConnection({
	host:"127.0.0.1",
	user:"root",
	password:"9148858352",
	database:"se"
});
connection.connect(function(err){
	if (err) {
		console.error('error connecting:'+ err.stack);
		return;
	}
});

app.get('/adminlogin', function (req, res) {
	
res.sendFile(__dirname+'/public/adminlogin.html')

})
app.get('/forgetpassword', function (req, res) {
	
res.sendFile(__dirname+'/public/forgetpass.html')

})
app.get('/studentlogin', function (req, res) {
	res.sendFile(__dirname+'/public/studentlogin.html')

})
app.get('/studentsingup', function (req, res) {
	res.sendFile(__dirname+'/public/signup.html')

})

app.get('/adminlogin2', function (req, res) {



	var aduser = req.query.adminusername;
	var adpass = req.query.adminpassword;

	console.log(aduser);
	connection.query('SELECT * FROM se.admin where adminid= ? and adpass =?',[aduser,adpass],function(err,result,feilds){
				
			numRows = result.length;
			if (numRows > 0) {
			res.sendFile(__dirname+'/public/heyadmin.html')

		}
		else{
				res.sendFile(__dirname+'/public/adminlogin.html')

		}

		
	})

})

app.get('/studentlogin2', function (req, res) {



	var sduser = req.query.studentusername;
	var sdpass = req.query.studentpassword;
	connection.query('SELECT * FROM student where sdid= ? and sdpass =?',[sduser,sdpass],function(err,result,feilds){

		numRows = result.length;
		if (numRows > 0) {
			res.render('profile', {username:sduser});

		}
		else{
				res.sendFile(__dirname+'/public/studentlogin.html')

		}

		
	})

})

app.get('/studentloginaftersingup', function (req, res) {
	var sduser = req.query.studentusername;
	var sdpass = req.query.studentpassword;
	var sdcnfpass = req.query.studentcnfpassword;
	var sdemail = req.query.studentemail;

	console.log(sduser);
	console.log(sdcnfpass);
	console.log(sdpass);
	if(sdpass != sdcnfpass){
		res.sendFile(__dirname+'/public/signup.html')
	}
	else{
		connection.query('insert into student(sdid,sdpass,sdemail) values (?,?,?)',[sduser,sdpass,sdemail],function(err,result,fields){
			if(err) throw err;
			res.sendFile(__dirname+'/public/studentlogin.html')

		})

		connection.query('insert into student_info(name,address,DOB,sdid,proof) values (?,?,?,?,?)',['0','0','0',sduser,'0'],function(err,result,fields){
			

		})
	}
	
})

app.get('/forgetpassword2', function (req, res) {
	var sduser = req.query.studentusername;
	var sdnpass = req.query.studentnewpassword;
	var sdcnfnpass = req.query.studentnewcnfpassword;
	

	console.log(sduser);
	console.log(sdcnfnpass);
	console.log(sdnpass);
	if(sdnpass != sdcnfnpass){
		res.sendFile(__dirname+'/public/forgetpass.html')
	}
	else{
		connection.query('update student set sdpass = ? where sdid = ?',[sdnpass,sduser],function(err,result,fields){
			if(err) throw err;
			res.sendFile(__dirname+'/public/studentlogin.html')

		})
	}
	
})

app.get('/booking', function (req, res) {
	
res.render('booking.ejs')

})
app.get('/library/:username', function (req, res) {
	var usname = req.params.username;
res.render('profile2',{username:usname})

})

app.get('/profilemanagement/:username', function (req, res) {


	var usname = req.params.username;
	
res.render('profilemanage',{username:usname})

})

app.get('/updateinfo/:username', function (req, res) {

	var usname = req.params.username
	var dob = req.query.date;
	var fname = req.query.fname;
	var cntpass = req.query.cntpass;
	var address = req.query.address;
	var addressproof = req.query.addressproof;

	console.log(addressproof)
	console.log(dob)

	connection.query('update student_info join student on student.sdid=student_info.sdid set student_info.DOB =?,student_info.name=?,student.sdpass=?,student_info.address=?,student_info.proof=? where student.sdid =?',[dob,fname,cntpass,address,addressproof,usname],function(err,result,fields){
			if(err) throw err;
			

		})
		connection.query('SELECT * from student join student_info on student.sdid = student_info.sdid where student.sdid = ?',[usname],function(err,result,fields){
			if(err) throw err;
			
			console.log(result)


			res.render('profilemanage2',{username:usname,data:result})
		})


})




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


