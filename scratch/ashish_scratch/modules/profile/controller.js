
/*
 * @module Profile
 */
  
module.exports = 
{

  /* A subscriber is able to create a switch profile
   * 
   * 
   * 
   * 
   * @method create
   * @param req - HTTP POST request object sent by  subscriber
   * @param res - HTTP response object which will be sent to the subscriber
   * 
   */
  create: function(req, res, next) {
		// find subcriber id via auth token

    req.models.switch_profile.create( {
    	sub_id: 1, //temp hard code sub id until auth tokens work 
      name: req.body.profile_name
    }, function(err,profile) {
			if(err){
				console.log('unable to create switch profile');
				console.log(err);
			}
      else{
				req.models.dp_caps.create( {
        	profile_id : profile.sub_id,
					vp_any : req.body.vp_any,
					vp_local : req.body.vp_local,
					vp_normal : req.body.vp_normal,
					vp_flood : req.body.vp_flood
				}, function(err, dp_caps) {
					if(err){
						console.log('unable to create db_caps');
						console.log(err);
					}else{
						req.models.ft_caps.create({
							dp_id:dp_caps.id
					}, function(err, ft_caps){
						if(err){
							console.log('unable to create ft_caps');
							console.log(err);
						} else {
							req.models.match_caps.create({
								ft_id: ft_caps.id,
                ofpxmt_ofb_in_phy_port: req.body.ofpxmt_ofb_in_phy_port,
								ofpxmt_ofb_in_port: req.body.ofpxmt_ofb_in_port,
								ofpxmt_ofb_eth_dst: req.body.ofpxmt_ofb_eth_dst,
							  ofpxmt_ofb_eth_src: req.body.ofpxmt_ofb_eth_src,
								ofpxmt_ofb_eth_type: req.body.ofpxmt_ofb_eth_type
							}, function(err, match_caps){
								if(err){
									console.log('unable to create match_caps');
                  console.log(err);
								} else {
									req.models.instruction_caps.create({
										ft_id: ft_caps.id
									}, function(err, ins_caps){
										if(err){
											console.log('unable to create ins caps');
											console.log(err);
										}
									   else {
											req.models.action_caps.create({
												ft_id: ft_caps.id,
												ofpat_output: req.body.ofpat_output,
												ofpat_set_field_eth_dst: req.body.ofpat_set_field_eth_dst,
												ofpat_set_field_eth_src: req.body.ofpat_set_field_eth_src
											}, function(err, act_caps) {
												if(err){
												  console.log('could not create action caps');
													console.log(err);
												}
												else {
													console.log('created profile sucessfully');
												  res.writeHeader('201',{
															'Content-Type': 'application/json'
													});
													res.end(JSON.stringify({message:'created profile sucessfully'}));
												}
											});
										}
									});
								}
							});
						 }
					 });
				  }
				});
			}
		});
  }

}

