import React, { useState, useEffect } from 'react';
import SensorGauge from '../components/GaugeChart';
import { 
  fetchSensor1Data, 
  fetchSensor2Data, 
  fetchFireSmokeData, 
  fetchElectricityData 
} from '../api/api';
import { SensorData, ApiAsapData, ListrikData } from '../types';
import { format } from 'date-fns';
import { Download, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [sensor1Data, setSensor1Data] = useState<SensorData | null>(null);
  const [sensor2Data, setSensor2Data] = useState<SensorData | null>(null);
  const [fireSmokeData, setFireSmokeData] = useState<ApiAsapData | null>(null);
  const [electricityData, setElectricityData] = useState<ListrikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [sensorStatus, setSensorStatus] = useState({
    sensor1: false,
    sensor2: false,
    fireSmoke: false,
    electricity: false
  });

  const fetchData = async () => {
    try {
      const [sensor1, sensor2, fireSmoke, electricity] = await Promise.all([
        fetchSensor1Data(),
        fetchSensor2Data(),
        fetchFireSmokeData(),
        fetchElectricityData()
      ]);
      
      setSensor1Data(sensor1);
      setSensor2Data(sensor2);
      setFireSmokeData(fireSmoke);
      setElectricityData(electricity);
      setLastUpdate(new Date());
      
      // Update sensor status
      setSensorStatus({
        sensor1: !!sensor1,
        sensor2: !!sensor2,
        fireSmoke: !!fireSmoke,
        electricity: !!electricity
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">
            Last updated: {format(lastUpdate, 'dd MMM yyyy HH:mm:ss')}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Auto refresh:</span>
            <select 
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-gray-700 text-white text-sm rounded-md border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
            <button 
              onClick={fetchData}
              className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors duration-200 flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <Download size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.electricity ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Phase R Voltage"
            value={electricityData?.phase_r || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
        
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.electricity ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Phase S Voltage"
            value={electricityData?.phase_s || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
        
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.electricity ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Phase T Voltage"
            value={electricityData?.phase_t || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.sensor1 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Temperature (Sensor 1)"
            value={sensor1Data?.suhu || 0}
            minValue={0}
            maxValue={50}
            unit="°C"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
        
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.sensor1 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Humidity (Sensor 1)"
            value={sensor1Data?.kelembapan || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#3b82f6"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>

        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.sensor2 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Temperature (Sensor 2)"
            value={sensor2Data?.suhu || 0}
            minValue={0}
            maxValue={50}
            unit="°C"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
        
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.sensor2 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Humidity (Sensor 2)"
            value={sensor2Data?.kelembapan || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#3b82f6"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.fireSmoke ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Fire Detection"
            value={fireSmokeData?.api_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
        
        <div className="col-span-1 relative">
          <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
            sensorStatus.fireSmoke ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <SensorGauge
            title="Smoke Detection"
            value={fireSmokeData?.asap_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#64748b"
            lastUpdate={lastUpdate}
            showStatus={true}
            animate={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;