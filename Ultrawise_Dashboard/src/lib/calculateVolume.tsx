export const calculateVolume = (volume : number, height : number) => {
    // calculating radius using sqrt(v/(height * pi))
    let radius = Math.sqrt(volume / (height * Math.PI))
    return radius
}

export const waterLevelCalculate = (ultrasonicHeight:number,radius:any,height:number,volume:number) => {
    let waterHeight = height - ultrasonicHeight;
    let waterVolume = Math.PI * Math.pow(radius,2) * waterHeight;
    let waterLevel = (waterVolume / volume) * 100
    return waterLevel
}

export const consumption = (radius: any) => {
    // gotten from backend
    let soc = [1,2,3,4,5]
    if(soc.length == 0) return null
    let result = [soc[0]]
    for (let i = 1;i<soc.length;i+=1){
        let diff = soc[1] - soc[0]
        result.push(diff)
    }
    let total = result.reduce((a,b) => a + b,0)
    let volumeConsumed = Math.PI * Math.pow(radius,2) * total
    return volumeConsumed
}

export const flowRate = (radius:any) => {
    let data = [1,2,3,4,5]
    if(data.length == 0) return null
    let result = [data[0]]
    for (let i = 1;i<data.length;i+=1){
        let diff = data[1] - data[0]
        result.push(diff)
    }
    
    let total = result.reduce((a,b) => a + b,0)
    let volume = Math.PI * Math.pow(radius,2) * total
    let avgFlowRate = volume/data.length
    return avgFlowRate
}