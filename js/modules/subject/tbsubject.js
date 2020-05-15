$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'subject/tbsubject/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 30, key: true },
			{ label: '类型:1选择题 2.判断题', name: 'type', index: 'type', width: 120 },
			{ label: '简介', name: 'title', index: 'title', width: 80 }, 			
			{ label: '题目', name: 'subject', index: 'subject', width: 80 }, 			
			{ label: '选择A/选择√', name: 'choice1', index: 'choice1', width: 80 }, 			
			{ label: '选择B/选择×', name: 'choice2', index: 'choice2', width: 80 }, 			
			{ label: '选择C', name: 'choice3', index: 'choice3', width: 80 }, 			
			{ label: '选择D', name: 'choice4', index: 'choice4', width: 80 }, 			
			{ label: '正确选择', name: 'rightChoice', index: 'right_choice', width: 80 }, 			
			{ label: '创建时间', name: 'createTime', index: 'create_time', width: 80 }, 			
			{ label: '修改时间', name: 'updateTime', index: 'update_time', width: 80 }			
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
	el:'#app',
	data:{
		showList: true,
		title: null,
		tbSubject: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.tbSubject = {"type":"0","rightChoice":"0"};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.tbSubject.id == null ? "subject/tbsubject/save" : "subject/tbsubject/update";
			vm.tbSubject.createTime=formatDate1(new Date().getTime());
			vm.tbSubject.updateTime=formatDate1(new Date().getTime());
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.tbSubject),
			    success: function(r){
					if(r.code === 0){
						alert('操作成功', function(){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "subject/tbsubject/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "subject/tbsubject/info/"+id, function(r){
                vm.tbSubject = r.tbSubject;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});