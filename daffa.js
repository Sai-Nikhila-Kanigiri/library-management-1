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

		connection.query('insert into student_info(name,address,DOB,proof,account,balance,sdid) values (?,?,?,?,?,?,?)',['0','0','0',sduser,'0','0',sduser],function(err,result,fields){
			

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

app.get('/payment/:username/:price/:bid', function (req, res) {

	var bprice= req.params.price;
	var usname= req.params.username;
	var bid = req.params.bid;

	console.log("hello my dear")

	
connection.query('select * from student_info where sdid= ? ',[usname],function(err,result,fields){
			if(err) throw err;
			var accbal = result[0].balance;

			console.log("balancecheck")
			console.log(result)
			console.log(result[0].balance)
			if (result[0].balance<bprice) {

				remamtbal= bprice-accbal;
				console.log(remamtbal)
					connection.query('update student_info set balance= ? where sdid = ?',['0',usname],function(err,result,fields){
			if(err) throw err;
		

						

		})




				res.render('wallet4',{data:result,username:usname,remamt:remamtbal,bid:bid})

			}

			else {
				console.log("wallet amount is enough")

				accbal= accbal-bprice;

				connection.query('update student_info set balance= ? where sdid = ?',[accbal,usname],function(err,result,fields){
			if(err) throw err;
			res.render('walletaftbkg',{username:usname,rembal:accbal})

				connection.query('insert into sd_book(sdid,bid) values(?,?)',[usname,bid],function(err,result,fields){
			if(err) throw err;
			

		})
			

		})


			}
			

		})

})


app.get('/creditcard2/:username/:remamt/:bid', function (req, res) {
	
res.render('creditcard2' ,{username:req.params.username,remamt:req.params.remamt,bid : req.params.bid})

})

app.get('/crtcrdpay/:username/:remamt/:bid', function (req, res) {



	var bal = req.query.balance;

	var remamt = req.params.remamt;
	var usname= req.params.username;
	var bid = req.params.bid;

	if(bal < remamt){

		res.render('creditcard3' ,{username:req.params.username,remamt:remamt,bid : req.params.bid})

	}


	else {

			connection.query('insert into sd_book(sdid,bid) values(?,?)',[usname,bid],function(err,result,fields){
			if(err) throw err;
			

		})


		res.render('succesful',{username:usname})
	}
		
	


})


app.get('/profile2/:username', function (req, res) {
	
res.render('profile2' ,{username:req.params.username})

})



app.get('/feed/:username', function (req, res) {

var usname = req.params.username;
var feed = req.query.fb;

	
res.render('feedback' ,{username:req.params.username})

})



app.get('/feedback/:username', function (req, res) {

var usname = req.params.username;
var feed = req.query.fb;
connection.query('insert into feedback(sdid,feed) values(?,?)',[usname,feed],function(err,result,fields){
			if(err) throw err;
			

		})

	
res.render('profile2' ,{username:req.params.username})

})

app.get('/switching/:username', function (req, res) {
	
res.render('switchng' ,{username:req.params.username})

})

app.get('/sbanking/:username', function (req, res) {
	
res.render('bankings2' ,{username:req.params.username})

})

app.get('/cbanking/:username', function (req, res) {
	
res.render('credit_card' ,{username:req.params.username})

})



app.get('/carting/:bid/:username', function (req, res) {

	var usname = req.params.username;
	var bid = req.params.bid;
	

	console.log(usname)
	console.log(bid)


connection.query('insert into cart(sdid,bid) values(?,?)',[usname,bid],function(err,result,fields){
			if(err) throw err;
			

		})

connection.query('SELECT * FROM cart,books where cart.sdid= ?  and books.bid= ?  order by cid desc ',[usname,bid],function(err,result,fields){
			if(err) throw err;
			console.log(result);
			res.render('dam',{data:result, username: usname});
		})

})


app.get('/library/:username', function (req, res) {
	var usname = req.params.username;
res.render('profile2',{username:usname})

})

app.get('/profilemanagement/:username', function (req, res) {


	var usname = req.params.username;
	
res.render('profilemanage',{username:usname})

})


app.get('/wallet/:username', function (req, res) {


	var usname = req.params.username;

	connection.query('SELECT * from student join student_info on student.sdid = student_info.sdid where student.sdid = ?',[usname],function(err,result,fields){
			if(err) throw err;
			
			console.log(result)

			// var bal = result[0].balance;
			// var z= bal+bal;
			// console.log(z)
			res.render('wallet',{username:usname,data:result})
		})
	


})


app.get('/banking1/:username', function (req, res) {


	var usname = req.params.username;

	var previousbal1 = req.params.previousbal;
res.render('bankings2',{username:usname,previousbal2 :previousbal1})

})



app.get('/bookafter/:username', function (req, res) {


	var usname = req.params.username;
res.render('profile2',{username:usname})

})

app.get('/walletupdate/:username', function (req, res) {


	var usname = req.params.username;
	var balance =req.query.balance;
	
	connection.query('select * from student join student_info on student_info.sdid=student.sdid where student_info.sdid=?',[usname],function(err,result,fields){
			if(err) throw err;

			console.log("before update")

			console.log(result)

			var actbal= parseInt(result[0].balance,10) + parseInt(balance,10);
			
			connection.query('update student_info join student on student.sdid=student_info.sdid set student_info.balance=? where student.sdid =?',[actbal,usname],function(err,result,fields){


				res.render('wallet2',{username:usname,bal:actbal})
			
		})
			
		})		

})



app.get('/bookdetails/:username', function (req, res) {

	var catslt = req.query.category;
	var catdate= req.query.date;
	var catsrc = req.query.search;
	var usname = req.params.username;
	console.log(catslt)
	console.log(catsrc)

	if(catslt=="author"){
	
			connection.query('SELECT * FROm books where bauthor= ? ',[catsrc],function(err,result,fields){
			if(err) throw err;
			console.log(result);
			res.render('books',{data:result, username: usname, date:catdate});
		})

	}
	else if(catslt=="genre"){
			connection.query('SELECT * FROM books where genre = ? ',[catsrc],function(err,result,fields){
			if(err) throw err;
			console.log(result);
			res.render('books',{data:result , username: usname,date:catdate});
		})
	}

	else if(catslt=="book"){
			connection.query('SELECT * FROM books where bname = ? ',[catsrc],function(err,result,fields){
			if(err) throw err;
			console.log(result);
			res.render('books',{data:result , username: usname,date:catdate});
		})
	}
})


app.get('/bookings/:username', function (req, res) {


	var usname = req.params.username;

	console.log(usname)
	connection.query('select * from books join sd_book on sd_book.bid=books.bid where sd_book.sdid=?',[usname],function(err,result,fields){
			if(err) throw err;
			
			console.log(result)


			res.render('booking',{username:usname,data:result})
		})
})

app.get('/updateinfo/:username', function (req, res) {

	var usname = req.params.username
	var dob = req.query.date;
	var fname = req.query.fname;
	var cntpass = req.query.cntpass;
	var address = req.query.address;
	var addressproof = req.query.addressproof;

	console.log(dob[1])

	console.log(addressproof)
	console.log(dob)

	connection.query('update student_info join student on student.sdid=student_info.sdid set student_info.DOB =?,student_info.name=?,student.sdpass=?,student_info.address=?,student_info.proof=?,student_info.account=?,student_info.balance= ? where student.sdid =?',[dob,fname,cntpass,address,addressproof,'1234','9999',usname],function(err,result,fields){
			if(err) throw err;
			

		})
		connection.query('SELECT * from student join student_info on student.sdid = student_info.sdid where student.sdid = ?',[usname],function(err,result,fields){
			if(err) throw err;
			
			console.log(result)


			res.render('profilemanage2',{username:usname,data:result})
		})


})




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


