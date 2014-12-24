define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/userlistTemplate.html',
  'collection/sm/UserCollection'
], function($, _,Backbone, userlistTemplate, UserCollection){
    var UserListView = Backbone.View.extend({
        el:$(".mid-container"),
        events:{
    		
    	},
    	initialize:function(){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'close');
    		
    		this.collection = new UserCollection();
    		
    		$(this.el).html('');
    	    $(this.el).empty();
    	},
    	render:function(){
            $(this.el).append(userlistTemplate);
            
    		var userListTable = $(this.el).find('#userListTable');
    		
    		this.collection.fetch({
    		    success : function(data){
            		for(var i =0; i<data.length; i++){
            		    var tr = $('<tr>');
            		    tr.append('<td>'+data.models[i].attributes.id+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.name+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.department+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.name_commute+'</td>');
            		    tr.append('<td>'+data.models[i].attributes.join_company+'</td>');
            		    userListTable.append(tr);
            		}
    		    }   
    		});
     	},
     	close:function(){
     	    this.undelegateEvents();
            this.$el.removeData().unbind(); 
            
     	}
    });
    
    return UserListView;
});