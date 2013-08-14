module.exports = function(app) {
    app.get('/admin?', function(req,res){
        res.send("Hello World");
    });
    
    app.get('/admin/transfer', function(req, res) {
        fs.readFile(__dirname + '/../../static/transfer.html', 'utf8', function(err, terms){
            if (err) {
                console.log(__dirname + '/../../static/transfer.html');
                console.log(err);
                res.send(500);
            }
            else if (terms) {
                res.send(200, terms);
            }
        });
    });

    app.post('/admin/transfer', function(req, res) {
        // make a stripe transfer to a user
        var aggid = req.body.aggid;
        var amount = req.body.amount;
        var bankacct;
        
        // find the user and get the bankacct details
        User.findOne({"aggid":aggid},function(err, doc){
            if(doc){
                // lets get them their money
                var bankacct_id = doc.bankacct.id;
        
                Stripe.transfers.create(
                {
                    amount: amount,
                    currency: 'usd',
                    recipient: bankacct_id,
                    description: 'Transfer to ' + aggid
                }, function(err, transfer) {
                    if (err) {
                     console.log(err.message);
                     res.send(400);
                     return;
                  }
                  res.send(transfer);
                  //TODO: Log transfer to DB
                });
                
            } else if (err) {
                res.send(err);
            } else {
                res.send(err);
            }
        });
    });
};
