var pg = require('pg');

//var con_string = 'tcp://' + process.env.DB_USER + ':' + process.env.DB_PWD + '@' + process.env.DB_HOST + ':5432/' + process.env.DB_NAME;
var con_string = process.env.DATABASE_URL;

//Build the dropdown for Selected Tree (List of Topics by Sensor)
exports.getmenuforselectedtreenode = function(req, res) {
	var rootid = req.query.rootid;
	console.log("topology/getmenuforselectedtreenode: getting data from Topomenu table");
	
  var pg_client = new pg.Client(con_string);
	pg_client.connect();
	
  var sql = "WITH RECURSIVE recursetree(menuid, menutitle, parentmenu, layout) AS\
  ( SELECT menuid, menutitle, parentmenu, layout\
    FROM topomenu WHERE  menuid = "+rootid+"\
    UNION ALL \
    SELECT t.menuid, t.menutitle, t.parentmenu, rt.layout\
    FROM topomenu t JOIN recursetree rt ON rt.menuid = t.parentmenu\
  )\
  SELECT  control_type as param,menuid as topoid, m.id as tagid, r.menutitle,\
  topic, value::json as value, jsonb_pretty(coalesce(l.body,r.layout)::jsonb) layout,\
  (select jsonb_agg(c) from (\
  select jsonb_extract_path(jsonb_array_elements(jsonb_extract_path(body::jsonb->0, 'widgets')), 'id')::jsonb as ids \
  from layouts a\
  where a.name = l.name\
  ) c) as unqids\
  FROM recursetree r LEFT OUTER JOIN tagmetadata m\
  ON r.menuid = m.topomenuid LEFT OUTER JOIN layouts l \
  ON r.menutitle ILIKE l.name||'%'";
	var query = pg_client.query(sql);
	query.on('row', function (row, result) { 
      result.addRow(row); 
  });
  console.log("topology/getmenuforselectedtreenode: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getmenuforselectedtreenode: Wrapping up reading Topomenu table");        
      pg_client.end();
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getmenuforselectedtreenode: Query error: ' + err);
  });
}


exports.updatemenu = function(req, res) {
var title = req.body.menutitle;
   var path = req.body.path;
   var layout = req.body.layout;
   var id = req.body.menuid;
   console.log("inside update menu : layout",JSON.parse(layout));
   var layouttitle = JSON.parse(layout);
   console.log("inside update menu : layouttitle[0]",layouttitle[0]);
   var layoutname = layouttitle[0].title.split(/ *-* /);
   console.log("inside update menu : layoutname:",layoutname);
   console.log("topology/updatemenu: Layoutname extracted from layout: "+layoutname[0]);
    

    var pg_client = new pg.Client(con_string);
    pg_client.connect();
    //TODO For now lets just do string. Later build a logic to separate string vs integer
    var sql = "update topomenu set menutitle ='"+title+"', path='"+path+"', layout='"+layout+"' where menuid="+id ;
    const query = pg_client.query(sql);
    query.on("end", function (result) {          
        
        var message = { "statusText": "Success", "message": "Row updated", "status": 1, "data": result};
        var insert = "INSERT INTO layouts (name, body) SELECT '" + layoutname[0] + "','" + layout + "'";
        var upsert = "UPDATE layouts SET body='"+layout+"' WHERE name='" + layoutname[0] + "'";

        var sql1 = "WITH upsert AS (" + upsert + " RETURNING *) " + insert + " WHERE NOT EXISTS (SELECT * FROM upsert)";
        //console.log(sql1);
        pg_client.query(sql1).on('end', function(res){
          console.log("topology/updatemenu: Data upserted");
        });
        pg_client.end(); 
        res.send(message);
    });
    query.on('error', function(err) {
      console.log('topology/updatemenu: Query error: ' + err);
    });
    
}

//Used in layout actions, layot action calls insert layout data on success of it getmenu is called.
exports.getmenu = function(req, res) {
  console.log("topology/getmenu: getting data from Topomenu table");
	
  var pg_client = new pg.Client(con_string);
	pg_client.connect();
	
  var sql = "select menuid, menutitle, path, parentmenu, coalesce(l.body,t.layout) layout\
             from topomenu t left outer join layouts l \
              ON t.menutitle ILIKE l.name||'%'";
	var query = pg_client.query(sql);
	query.on('row', function (row, result) { 
      result.addRow(row); 
  });
  console.log("topology/getmenu: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getmenu: Wrapping up reading Topomenu table");        
      pg_client.end();

      //tree is being prepared in LayoutActions.js
      // sortedquery = _queryTreeSort({q:result.rows},"menuid")
      // tree = _makeTree({q:sortedquery}, "menuid")
      
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getmenu: Query error: ' + err);
  });
}

//This is being called in rolesTree and defaultLayoutSelection components. 
exports.getMenuForTree = function(req, res) {
  console.log("vikram");
  var isadmin = req.query.isadmin;
  var email = req.query.email;
  console.log("topology/getMenuForTree: getting data from Topomenu table");
  
  var pg_client = new pg.Client(con_string);
  pg_client.connect();
  
  if (isadmin !== undefined && isadmin === "true") {
    var sql = "select menuid as value, menutitle as label , path, parentmenu, coalesce(l.body,t.layout) layout\
             from topomenu t left outer join layouts l \
              ON t.menutitle ILIKE l.name||'%'";
  }
  else
  {
    var sql = "select * from\
              (WITH RECURSIVE recursetree(menuid, menutitle, path, parentmenu, layout) AS (\
                SELECT menuid, menutitle, path, parentmenu, layout\
                FROM topomenu\
                WHERE menuid::text in (select distinct json_array_elements_text(roles) from  (\
                                  select  r.roles\
                                  from users u, usergroups ug, roles r \
                                  where u.usergroup::numeric = ug.groupid\
                                  and ug.groupid = r.usergroupid\
                                  and u.email = '"+email+"') as p)\
                UNION ALL\
                SELECT t.menuid, t.menutitle, t.path, t.parentmenu, t.layout\
                FROM topomenu t JOIN recursetree rt ON rt.parentmenu = t.menuid\
            )\
            SELECT  distinct menuid as value, menutitle as label , path, parentmenu, coalesce(l.body,layout) layout\
            FROM recursetree r left outer join layouts l\
            ON menutitle ILIKE l.name||'%') c\
            order by parentmenu, nullif(regexp_replace(c.label, '\\D', '', 'g'), '')::int ;"
  }
  var query = pg_client.query(sql);
  query.on('row', function (row, result) { 
           result.addRow(row); 
  });
  
  console.log("topology/getMenuForTree: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getMenuForTree: Wrapping up reading Topomenu table", result.rows);        
      pg_client.end();
      //sortedquery = react_queryTreeSort({q:result.rows})
      // sortedquery = _queryTreeSort({q:result.rows},"value")
      // tree = _makeTree({q:sortedquery},"value")
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getMenuForTree: Query error: ' + err);
  });
}

//Not used in the react world
exports.getParentForTag = function(req, res) {
  var tagid = req.query.tagid;
  var pg_client = new pg.Client(con_string);
  pg_client.connect();
  var sql = "select t.menutitle tagid, c.menutitle telemonid from topomenu t,\
           topomenu c where c.menuid = t.parentmenu and t.menutitle = '"+tagid+"'";
  var query = pg_client.query(sql);
  query.on('row', function (row, result) { 
      result.addRow(row); 
  });
  console.log("topology/getParentForTag: got tag to parent map");
  query.on("end", function (result) {  
      console.log("topology/getParentForTag: Wrapping up reading Topomenu table");        
      pg_client.end();
      res.send(result.rows[0]);  
  });
  query.on('error', function(err) {
    console.log('topology/getParentForTag: Query error: ' + err);
  });
}

//Not used in the react world
exports.getTopoToTagHierarchy = function(req, res) {
  var tagid = req.query.tagid;
  var parentid = req.query.parentid;
  console.log(parentid)
  if ( parentid === 'undefined' || parentid === '' ) { parentid = -1; }
  var pg_client = new pg.Client(con_string);
  pg_client.connect();
  var sql = "WITH RECURSIVE recursetree(menuid, menutitle, parentmenu, parentname) AS (\
                SELECT menuid, menutitle, parentmenu, (select menutitle from topomenu where (menuid is null or menuid = "+parentid+ ")) as parentname\
                FROM topomenu \
                WHERE menutitle = '"+ tagid +"' and (parentmenu is null or parentmenu = "+parentid + ")\
                UNION ALL\
                SELECT t.menuid, t.menutitle, t.parentmenu, rt.menutitle\
                FROM topomenu t JOIN recursetree rt ON rt.menuid = t.parentmenu\
            )\
            SELECT  control_type as param, telemonid||'_'||control_type||'_change_'||tagid as topic, value::json as value\
            FROM recursetree r LEFT OUTER JOIN tagmetadata m\
            ON r.menutitle = m.tagid and r.parentname = m.telemonid\
            where control_type is not null";
  var query = pg_client.query(sql);
  query.on('row', function (row, result) { 
      result.addRow({param: row.param, data:{topic: row.topic, values: row.value}}); 
  });
  console.log("topology/getTopoToTagHierarchy: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getTopoToTagHierarchy: Wrapping up reading Topomenu table");        
      pg_client.end();
      /*sortedquery = _queryTreeSort({q:result.rows})
      tree = _makeTree({q:sortedquery})
      var ids = findIds(tree,"bangalore");
      console.log(ids);*/
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getTopoToTagHierarchy: Query error: ' + err);
  });

}

// This function is used in rolesTree component.
// Gets the tagmetadata info associated with selected node. Using **getmenuforselectedtreenode** for now
// This query builds only the children
// While getmenuforselectedtreenode returns the parents along with the children
exports.getChildrenForAnyNode = function(req, res) {
  var rootid = req.query.rootid;
  var pg_client = new pg.Client(con_string);
  pg_client.connect();
 /* var sql = "WITH RECURSIVE recursetree(menuid, menutitle, parentmenu, parentname) AS (\
                SELECT menuid, menutitle, parentmenu, (select menutitle from topomenu where (menuid = " + rootid + ")) as parentname\
                FROM topomenu \
                WHERE  parentmenu = " + rootid + "\
                UNION ALL\
                SELECT t.menuid, t.menutitle, t.parentmenu, rt.menutitle\
                FROM topomenu t JOIN recursetree rt ON rt.menuid = t.parentmenu\
            )\
            SELECT  control_type as param, menuid as topoid, m.id as tagid, telemonid||'_'||control_type||'_change_'||tagid as topic, value::json as value\
            FROM recursetree r LEFT OUTER JOIN tagmetadata m\
            ON r.menutitle = m.tagid and r.parentname = m.telemonid\
            where control_type is not null"; */
			
var sql = "WITH RECURSIVE recursetree(menuid, menutitle, parentmenu, parentname) AS (\
               SELECT menuid, menutitle, parentmenu, (select menutitle from topomenu where (menuid = " + rootid + ")) as parentname \
               FROM topomenu \
               WHERE  parentmenu = " + rootid + "\
               UNION ALL \
               SELECT menuid, menutitle, parentmenu, (select menutitle from topomenu where (menuid = parentmenu)) as parentname \
               FROM topomenu \
               WHERE  menuid = "+ rootid + " AND NOT EXISTS (SELECT * from topomenu WHERE parentmenu = " + rootid + ") \
               UNION ALL \
               SELECT t.menuid, t.menutitle, t.parentmenu, rt.menutitle \
               FROM topomenu t JOIN recursetree rt ON rt.menuid = t.parentmenu \
           ) \
           SELECT  control_type as param,menuid as topoid, m.id as tagid, topic, value::json as value \
           FROM recursetree r LEFT OUTER JOIN tagmetadata m \
           ON r.menuid = m.topomenuid \
           where control_type is not null";			
  var query = pg_client.query(sql);
  query.on('row', function (row, result) { 
      result.addRow({param: row.param, topoid: row.topoid, tagid: row.tagid, data:{topic: row.topic, values: row.value}}); 
  });
  console.log("topology/getChildrenForAnyNode: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getChildrenForAnyNode: Wrapping up reading Topomenu table");        
      pg_client.end();
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getChildrenForAnyNode: Query error: ' + err);
  });

}

// Not used. Incorporated in **getMenuForTree**
exports.getHierarchyForRoles = function(req, res) {
  var email = req.query.email;

  var pg_client = new pg.Client(con_string);
  pg_client.connect();

  var sql = "WITH RECURSIVE recursetree(menuid, menutitle, path, parentmenu, layout) AS (\
                SELECT menuid, menutitle, path, parentmenu, layout\
                FROM topomenu\
                WHERE menuid::text in (select json_array_elements_text(roles) from roles where roleid in (\
                                  select distinct roleid\
                                  from users u, usergroups ug, roles r \
                                  where u.usergroup::numeric = ug.groupid\
                                  and ug.groupid = r.usergroupid\
                                  and u.email = '"+ email +"'))\
                UNION ALL\
                SELECT t.menuid, t.menutitle, t.path, t.parentmenu, t.layout\
                FROM topomenu t JOIN recursetree rt ON rt.parentmenu = t.menuid\
            )\
            SELECT  distinct menuid as value, menutitle as label , path, parentmenu, coalesce(l.body,layout) layout\
            FROM recursetree r left outer join layouts l\
            ON menutitle ILIKE l.name||'%'";
  var query = pg_client.query(sql);
  
  query.on('row', function (row, result) { 
    result.addRow(row);
  });
  console.log("topology/getHierarchyForRoles: got data from Topomenu table");

  query.on("end", function (result) {  
      console.log("topology/getHierarchyForRoles: Wrapping up reading Topomenu table");        
      pg_client.end();
      // sortedquery = _queryTreeSort({q:result.rows},"value");
      // tree = _makeTree({q:sortedquery},"value");
      res.send(result.rows);  
  });
  query.on('error', function(err) {
    console.log('topology/getHierarchyForRoles: Query error: ' + err);
  });
}


// var _queryTreeSort = function(options, value) {
//   var cfi, e, i, id, o, pid, rfi, ri, thisid, _i, _j, _len, _len1, _ref, _ref1;
//   id = options.menuid || value;
//   pid = options.parentmenu || "parentmenu";
//   ri = [];
//   rfi = {};
//   cfi = {};
//   o = [];
//   _ref = options.q;
//   for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
//     e = _ref[i];
//     rfi[e[id]] = i;
//     if (cfi[e[pid]] == null) {
//       cfi[e[pid]] = [];
//     }
//     cfi[e[pid]].push(options.q[i][id]);
//   }
//   _ref1 = options.q;
//   for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
//     e = _ref1[_j];
//     if (rfi[e[pid]] == null) {
//       ri.push(e[id]);
//     }
//   }
//   while (ri.length) {
//     thisid = ri.splice(0, 1);
//     o.push(options.q[rfi[thisid]]);
//     if (cfi[thisid] != null) {
//       ri = cfi[thisid].concat(ri);
//     }
//   }
//   return o;
// };

// var _makeTree = function(options,value) {
//   var children, e, id, o, pid, temp, _i, _len, _ref;
//   id = options.menuid || value;
//   pid = options.parentmenu || "parentmenu";
//   children = options.children || "children";
//   temp = {};
//   o = [];
//   _ref = options.q;
//   for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//     e = _ref[_i];
//     e[children] = [];
//     temp[e[id]] = e;
//     if (temp[e[pid]] != null) {
//       temp[e[pid]][children].push(e);
//     } else {
//       o.push(e);
//     }
//   }
//   return o;
// };

// function getLeafNodes(leafNodes, obj){
//     if(obj.children){
//         obj.children.forEach(function(child){getLeafNodes(leafNodes,child)});
//     } else{
//         leafNodes.push(obj);
//     }
// }

// function findIds(json,name){ 
//    if(json.children){       
//         if(json.menutitle==name)  {
//            var leafNodes = [];   
//            getLeafNodes(leafNodes,json);
//            console.log(leafNodes.map(function(leafNode){ return leafNode.id; })); //Logs leaf node ids to the console
//         } else {
//            json.children.forEach(function(child){                               
//               findIds(child,name);
//            });      
//         }   
//    }
// }
