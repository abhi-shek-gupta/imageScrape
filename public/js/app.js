const app=angular.module('myapp',['ngRoute','ngMessages']);
app.config(function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'views/search.html',
        controller:'Acontroller'
    });
    $routeProvider.when('/recentQuery',{
        templateUrl:'views/recentSerach.html',
        controller:'recentQueryController'
    });
    $locationProvider.html5Mode(true);	
})

app.run(function(){
    console.log("app.run running");
});


app.controller("Acontroller",function($scope,$http,$location){
    $scope.submitForm=function(){
console.log($scope.body); 
 $http({
     url:'/api/query',
     method:'POST',
     data:$scope.body
 }).then(function(res){
  $location.path('/recentQuery')
    console.log(res)
 },function(response){
     console.log(res)
    })
    }
})
 
app.controller("recentQueryController",function($scope,$http,$location){
 $http({
     url:'/api/query',
     method:'GET'
 }).then(function(res){
    
    console.log(res);
     $scope.resultArray=res.data.result;
     console.log($scope.resultArray);
 },function(response){
     console.log(res)
    })
    
})
