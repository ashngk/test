var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var portName = '/dev/ttyMotion';
var fs=require('fs');

var data1={
    "angle_x": 0,
    "angle_y": 0,
    "angle_z": 0,
    };
function MotionSensor(){

    this.getMotionData = function(){
        read();
        return data1;   
    }    
      
    this.motionSensorPortCheck= function(){
         return motioncheck=fs.existsSync('/dev/ttyMotion');
    }
   
   //连接串口，上电连接一次并且只能连接一次，如果要考虑串口断开再次插上的情况，需要在主函数中加判断
    this.motionSensorPortConnect= function(){
        client.connectRTUBuffered(portName, { baudRate: 9600 , dataBits: 8,  stopBits: 1, parity: 'none',autoOpen: false}).then(
        function(res)         
        {
            console.log('姿态传感器连接成功');    
        }).catch((err) =>{
            console.log(err+"连接失败")
           
        });    
     }        



    //这部分需要结合具体硬件的使用手册
    //发送 50 03 00 3d 00 03 99 86 给姿态传感器
    //0x50=80， 
    //03对应读保持寄存器
    //从地址0x03d开始读，读三个寄存器就是x，y，z的角度
    function read(){
        client.setTimeout(500);
        client.setID(80);//0x50
        client.readHoldingRegisters(0x003d, 3).then((data) => {    
            // console.log(data.data[0]);
            // console.log(data.data[1]);
            // console.log(data.data[2]);
            //console.log(data1)
            data1=parsedata(data);    
        }, (err) => {
            console.log(err);
        }); 
    
    }
    
    
    //把传感器数据转化成角度
    function parsedata(data)
    {  
        
        var x=(data.data[0])/32768*180;
        var y=(data.data[1])/32768*180;
        var z=(data.data[2])/32768*180;

        Data={
        "angle_x": (x>180)? (x=x-360):x,
        "angle_y": (y>180)? (y=y-360):y,
        "angle_z": (z>180)? (z=z-360):z,
        }
        return Data;
        //console.log("角度x:"+x+"角度y:"+y+"角度z"+z);
       // console.log(Data)
    }
        
}


module.exports = MotionSensor;
