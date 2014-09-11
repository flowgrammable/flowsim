
exports.generateProfileData = function(subId, data) {
  if (data.ofp_version == 0 )
		return generateOpenflow10(subId, data);
  else if(data.ofp_version == 1)
		return generateOpenflow11(data);
	else if(data.ofp_version == 2)
		return generateOpenflow12(data);
  else if(data.ofp_version == 3)
		return generateOpenflow13(data);
  else if(data.ofp_version == 4)
		return generateOpenflow14(data);
	else
    return msg.invalidVersion(); 
}

function generateOpenflow10(subId, data) { 
   var profile = generateDatapath10(subId, data);
   return profile 
}

function generateDatapath10(data){
   return {
      subscriber_id:   subId,
      name:            data.name,
      ofp_version:     0,
      datapath_id:     data.datapath_id,     
      n_buffers:       data.n_buffers,        
      n_tables:        1,                    
      n_ports:         data.n_ports,         
      ip_reassembly:   data.ip_reassembly,
      mfr_description: data.mfr_description, 
      hw_description:  data.hw_description,
      sw_description:  data.sw_description, 
      serial_num:      data.serial_num,
      dp_description:  data.dp_description,
      vp_all:          true,
      vp_controller:   true,
      vp_table:        true,
      vp_in_port:      true,
      vp_local:        true,
      vp_normal:       data.vp_normal,       
      vp_flood:        data.vp_flood,        
      flow_stats:      data.flow_stats,      
      table_stats:     data.table_stats,     
      port_stats:      data.port_stats,      
      group_stats:     false,     
      queue_stats:     data.queue_stats      
    }
}

		
