

const express	= require('express')
const cors		= require('cors')
const app		= express()
const path		= require('path')
var   port		= process.env.PORT || 3000
app.use(cors())	// Makes it cross-origin something
var print = console.log
function done(msg){ return { success : true, message : msg}}
function fail(msg){ return { success : false, message : msg}}

function areIdentical(o1, o2){
	if(o1.cine == o2.cine && o1.ce == o2.ce && o1.pret == o2.pret){
		return true
	} else {
		return false
	}
}

Array.prototype.removeItem = function(index){
	this.splice(index, 1)
}

function forEachKey(object, func){
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		func(key);
	}
}

// -------------------------------


var Restaurante = {
	KFC : {
		orders : [
			{
				cine : "Dave",
				ce : "Sandwich cu unt",
				restaurant : "KFC",
				pret : 20
			}
		]
	}
}
var Manager = {
	nume : "Vlad",
	revolut : "0723 392 481",
	iban : "RO2398ING2378913113"
}

app.put('/update_manager', (req, res)=>{
	Manager = req.body
	res.send(done("Updated"))
})
app.put('/add_order', (req, res)=>{
	let order = req.body
	if(order.restaurant != null){
		if(Restaurante[order.restaurant] == null){
			Restaurante[order.restaurant] = {orders:[]}
		}
		Restaurante[order.restaurant].orders.push(order)
		res.send(done('Order placed'))
	} else {
		res.send(fail('Invalid order'))
	}
})
app.get('/get_orders', (req, res)=>{
	let restaurant = req.body.restaurant
	if(restaurant != null){
		res.send(Restaurante[restaurant])
	} else {
		res.send(fail('Invalid restaurant name'))
	}
})
app.get('/get_all_orders', (req, res)=>{
	res.send(Restaurante)
})
app.get('/get_restaurant_names', (req, res)=>{
	let restaurantNames = []
	forEachKey(Restaurante, (restaurant)=>{
		restaurantNames.push(restaurant)
	})
	res.send(restaurantNames)
})
app.put('/delete_order', (req, res)=>{
	let order = req.body
	if(order.restaurant != null){
		if(Restaurante[order.restaurant] != null){
			let orders = Restaurante[order.restaurant].orders
			for(let i = 0; i<orders.length; i++){
				if(areIdentical(order, orders[i])){
					orders.removeItem(i)
					res.send(done('Order removed'))
					return
				}
			}
			res.send(fail('Order not found'))
		} else {
			res.send(fail('No such order exists'))
		}
	} else {
		res.send(fail('Invalid request'))
	}
})
app.put('/reset_orders', (req, res)=>{
	forEachKey(Restaurante, (r)=>{
		Restaurante[r] = {orders : []}
	})
	res.send(done('All orders reset'))
})


app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
})



