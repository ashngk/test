var MotionSensor = require('./Motion485test.js');  //引入Motion485test.js


//实例化姿态传感器,油量传感器
var myMotionSensor = new MotionSensor();
var motionchargeoff;

//1秒运行一次allcheck
const timer1 = setInterval(allCheck,10000,'doAllCheck');

function allCheck(){
  jsonData ={
      "motion": Motion(),//myMotionSensor.getMotionData(),//每秒读一次姿态传感器
      "motioncheck":myMotionSensor.motionSensorPortCheck(), //检查是否连接了姿态传感器   
    }

    console.log(jsonData);
}
  
  
  
//姿态传感器上电检测！！！
//首先要连接一次并且只能连接一次，才可以读数据
function Motion(){
	if(myMotionSensor.motionSensorPortCheck()==true&&motionchargeoff==0)  return myMotionSensor.getMotionData();
	else if(myMotionSensor.motionSensorPortCheck()==true&&motionchargeoff==1) motionchargeoff=0,myMotionSensor.motionSensorPortConnect();
	else if(myMotionSensor.motionSensorPortCheck()==false){
		motionchargeoff=1;
		return data1={
			"angle_x": 0,
			"angle_y": 0,
			"angle_z": 0,
			};
	}
	else{
		motionchargeoff=0;
		myMotionSensor.motionSensorPortConnect();
		return myMotionSensor.getMotionData();	
	}
}
