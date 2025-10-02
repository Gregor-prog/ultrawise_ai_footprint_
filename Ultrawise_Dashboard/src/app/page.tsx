"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { WaterUsageChart } from '@/components/dashboard/water-usage-chart';
import { SystemStatusCard } from '@/components/dashboard/system-status-card';
import {
  currentSensorData,
  recentActivities,
  systemHealth,
} from '@/lib/data';
import { Droplets, Waves, Gauge, Leaf, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState,useEffect } from 'react';
import ControlledModal from '@/components/inputValue';
import { consumption, flowRate, waterLevelCalculate } from '@/lib/calculateVolume';


export default function DashboardPage() {
  const [radius,setRadius] = useState<number | null>(null)
  const [dialog,setDialog] = useState(true)
  const [volume,setvolume] = useState(0)
  const [height, setheight] = useState(0)
  const [waterLevel, setwaterlevel] = useState(0)
  const [volumeConsumed,setConsumed] = useState(0)
  const [volumeFlowRate, setrate] = useState(0)
  

  // should be gotten from the backend, we are using dummy data for now
  let ultrasonicHeight = 100

  setInterval(() => {
    if(waterLevel == 0){
      let waterLevel = waterLevelCalculate(ultrasonicHeight,radius,height,volume)
    setwaterlevel(waterLevel)
    }
    if(volumeConsumed == 0){
    let volumeCons : any = consumption(radius)
    setConsumed(volumeCons)
    }
    if(volumeFlowRate == 0){
    let flowRateRe : any = flowRate(radius)
    setrate(flowRateRe)
    }
  }, 10000)

  useEffect(() => {
      if(radius === null || radius === undefined || radius ===  0 || Number.isNaN(radius)){
        setDialog(true)
      }else(
        setDialog(false)
      )
      let waterLevel = waterLevelCalculate(ultrasonicHeight,radius,height,volume)
      setwaterlevel(waterLevel)
  })
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Water Level"
          number={waterLevel}
          value={`${waterLevel.toFixed(4)}%`}
          icon={Droplets}
          description="Reservoir level"
        />
        <StatCard
          title="Average Flow Rate"
          number={volumeFlowRate}
          value={`${volumeFlowRate.toFixed(4)} L/min`}
          icon={Waves}
          description="Cooling system intake"
        />
        <StatCard
          title="Consumption"
          number={volumeConsumed}
          value={`${volumeConsumed.toFixed(4)} m³`}
          icon={Gauge}
          description="24-hour usage"
        />
        {/* <StatCard
          title="WUE"
          value={`${currentSensorData.wue} L/kWh`}
          icon={Leaf}
          description="Water Usage Effectiveness"
        /> */}
      </div>
      <div className="grid grid-cols-1 7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Historical Water Consumption</CardTitle>
            <CardDescription>Last 7 Days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WaterUsageChart />
          </CardContent>
        </Card>
        {/* <div className="col-span-1 space-y-4 lg:col-span-3">
          <SystemStatusCard systemHealth={systemHealth} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </p>
                    {index < recentActivities.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}
        <ControlledModal open={dialog} setopen={setDialog} radius={radius} setRadius={setRadius} volume={volume} setvolume={setvolume} height={height} setheight={setheight} />
      </div>
    </>
  );
}
