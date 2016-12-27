// 基础gulp模块
var gulp = require('gulp');
// webserver服务器模块
var webserver = require('gulp-webserver');

//mock数据操作,需要引入url及fs，但是url/fs是内置的，所以不需要安装
var url = require('url');
var fs = require('fs'); // fs -> filesystem

// sass转化
var sass = require('gulp-sass');

//js的模块化打包操作
var webpack = require('gulp-webpack');

//命名模块
var named = require('vinyl-named');
// cnpm install vinyl-named --save-dev

var uglify = require('gulp-uglify');

var minifyCss = require('gulp-minify-css');
// cnpm install gulp-minify-css --save-dev

//版本管理 
var rev = require('gulp-rev');
//版本控制
var revCollector = require('gulp-rev-collector');
//监控
var watch = require('gulp-watch');
//队列模块
var sequence = require('gulp-watch-sequence');

var img=require('gulp-imagemin');
/*
1.创建src(src是开发目录，所有操作都在src中进行)目录
2.在src新建index.html(因为我们现在做的是spa项目，所以，通过只有一个入口主文件)
3.实现index.html的文件复制操作，复制的目标是www
4.webserver的本地服务器配置(不是gulp-connect)
5.实现mock数据操作，先在根目录下创建mock目录，然后在目录里放置对应的json文件
	mock文件有skill.json/project.json/work.json，对应的接口地址配置为/api/skill,/api/project,/api/work
6.实现sass转换
7.实现js的模块化开发操作
*/

gulp.task('copy-index',function(){
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./www'));
});

//创建本地服务器任务
gulp.task('webserver', function() {
  gulp.src('./www')
    .pipe(webserver({
      livereload: true,
      //directoryListing:true,
      open:true,

      middleware:function(req,res,next){
      	//获取浏览器中的url，将url进行解析操作
      	var urlObj = url.parse(req.url,true),
      	method = req.method;

      	//如果url里输出了/skill.php,/project.php或者是/work，
      	//那么我们就可以查找到urlObj.pathname为/skill.php,/project.php,/work
      	//然后我们就可以通过这个变化的url地址内容去判断并且返回相应的
      	//skill.json/project.json/work.json等数据文件的内容
      	switch(urlObj.pathname){
      		case '/skill':
      			// Content-Type可以指定返回的文件的格式类型
      			res.setHeader('Content-Type','application/json');
      			//需要通过fileSystem文件操作函数，去读取指定目录下的json文件，并将读取到的内容返回到浏览器端
      			
      				var data = '[	{		"category":"规范",		"name":"HTML4、HTML5、ES5、ES6、CommonJS、CMD、AMD等",		"time":"1年",		"level":"了解"	},	{		"category":"框架",		"name":"Jquery、Zepto、AngularJs、Recat、Avalon等",		"time":"2年",		"level":"熟悉"	},	{		"category":"框架",		"name":"Mui、Yo、Ionic等",		"time":"2年",		"level":"熟悉"	},	{		"category":"类库",		"name":"Swiper、Iscroll等",		"time":"2年",		"level":"熟悉"	},	{		"category":"插件",		"name":"Jquery menu plugin、Jquery nav plugin、zepto emoji-expression-plugin等",		"time":"2年",		"level":"熟悉"	},	{		"category":"布局",		"name":"Fixed、Fulid、Flex、Responsive",		"time":"3年",		"level":"精通"	},	{		"category":"程序",		"name":"Javascript原生、Jquery及Zepto插件、AngularJs等",		"time":"3年",		"level":"精通"	}]'
      				res.end(data);

      		return;

      		case '/project':
      			res.setHeader('Content-Type','application/json');
      			var data='[	{		"category":"企业网站",		"name":"和瑞控股",		"url":"http://www.horays.com/",		"images":"./img/img7.jpg",		"description":"和瑞控股公司的官方网站，详细介绍了和瑞控股公司的主要情况",		"detail":"项目耗时3周，主要处理前端页面及程序嵌套，当时并未要求移动端适配，故该网站只适应于PC端应用",		"tech":"Html、Css2、Coldfusion等"	},	{		"category":"平台门户",		"name":"珍诚医药",		"url":"http://www.zc511.com/",		"images":"./img/img7.jpg",		"description":"医药电商先锋平台，国内医药电商B2B第一平台，年销售额超25亿",		"detail":"长期维护，功能迭代，包括平台整体UI改进以及功能模块的增加与性能的优化",		"tech":"Html、Css2、Javascript、Jquery、Java等"	},	{		"category":"平台门户",		"name":"网上药博会",		"url":"http://www.53118.com/",		"images":"./img/img7.jpg",		"description":"网上药博会，网上药品及药企展览平台",		"detail":"项目初建耗时4月，从需求到页面设计，从页面设计到前端实现，从页面实现到功能开发和集成，从本地测试到平台上线等全程处理",		"tech":"Html、Css2、Javascript、Jquery、Coldfusion等"	},	{		"category":"移动平台",		"name":"政教通",		"url":"http://www.zhengjiaotong.com/",		"images":"./img/img7.jpg",		"description":"儿童健康成长护航者",		"detail":"项目初建耗时3月，主要包括数据支撑平台的建设、移动端Hybrid模式的应用及开发",		"tech":"Html5、Css3、Jquery、AngularJs、Java等"	}]'
      			
      				res.end(data);
      			
      		return;

      		case '/work':
      			res.setHeader('Content-Type','application/json');
      			var data='[	{		"category":"私营企业",		"name":"杭州易网灵杰科技有限公司",		"url":"http://www.eoner.com/",		"image":"./img/zjyw.jpg",		"time":"2008年-2010年",		"posts":"技术副总",		"reportto":"总经理",		"peoples":"30",		"projects":"商企通视讯服务平台等"	},	{		"category":"民营企业",		"name":"浙江珍诚医药股份有限公司",		"url":"http://www.zc511.net/",		"image":"./img/zjyw.jpg",		"time":"2010年-2015年",		"posts":"技术总监",		"reportto":"总经理",		"peoples":"30",		"projects":"zc511.com、53118.com、learn511.com、珍诚掌上医药、客户B2C项目手机版、业务员管理系统等"	},	{		"category":"私营企业",		"name":"睿眼通（上海）信息科技有限公司",		"url":"http://www.ruiyantong.com/",		"image":"./img/zjyw.jpg",		"time":"2015年-2016年",		"posts":"技术总监",		"reportto":"总经理",		"peoples":"2",		"projects":"ruiyantong.com、zhengjiaotong.com、政教通App等"	}]'
      			
      				res.end(data);
      		return;
      	}
      
      	next(); // next是实现的循环
      } // end middleware

    })); // end gulp
});

gulp.task('img',function(){
	return gulp.src('./src/img/**')
	.pipe(gulp.dest('./www/img'));
});
gulp.task('mock',function(){
	return gulp.src('./src/mock/**')
	.pipe(gulp.dest('./www/mock'));
});
gulp.task('video',function(){
	return gulp.src('./src/video/**')
	.pipe(gulp.dest('./www/video'));
});

// index.css/main.scss--->www/css/index.css
// 通常我们主有一个入口的主文件index.scss/index.css
// @import 'xxx'

gulp.task('sass',function(){
	return gulp.src('./src/styles/index.scss')
	.pipe(sass())
	.pipe(minifyCss()) //css 压缩
	.pipe(gulp.dest('./www/css'));
})


gulp.task('packjs',function(){
	return gulp.src('./src/scripts/index.js')
	.pipe(named())
	.pipe(webpack())
	.pipe(uglify()) // js丑化压缩
	.pipe(gulp.dest('./www/js'));
})


//版本管理操作

var cssDistFiles = ['./www/css/index.css'];
var jsDistFiles = ['./www/js/index.js'];

gulp.task('verCss',function(){
	//找到要进行版本控制操作的目标文件
	return gulp.src(cssDistFiles)
	//生成相应的版本
	.pipe(rev())
	//复制到指定的目录
	.pipe(gulp.dest('./www/css'))
	//生成相应的映射文件
	.pipe(rev.manifest())
	//将映射文件复制到指定的目录
	.pipe(gulp.dest('./www/ver/css'))
})


gulp.task('verJs',function(){
	//找到要进行版本控制操作的目标文件
	return gulp.src(jsDistFiles)
	//生成相应的版本
	.pipe(rev())
	//复制到指定的目录
	.pipe(gulp.dest('./www/js'))
	//生成相应的映射文件
	.pipe(rev.manifest())
	//将映射文件复制到指定的目录
	.pipe(gulp.dest('./www/ver/js'))
})

//文件的字符串替换操作
gulp.task('html',function(){
	//src第一个参数是我们的映射资源文件，第二个参数是我们需要替换的html文件
	gulp.src(['./www/ver/**/*.json','./www/*.html'])
	//进行字符串替换操作
	.pipe(revCollector({
		replaceReved:true
	}))
	//复制文件到指定目录
	.pipe(gulp.dest('./www'))
})


//监听操作
gulp.task('watch',function(){
	gulp.watch('./src/index.html',['copy-index']);

	//设置队列
	var queue = sequence(300);
	watch('./src/scripts/**',{
		name:"JS",
		emitOnGlob:false
	}, queue.getHandler('packjs','verJs','html'));

	watch('./src/styles/**',{
		name:"CSS",
		emitOnGlob:false
	}, queue.getHandler('sass','verCss','html'));

});

gulp.task('default',['webserver','watch'])