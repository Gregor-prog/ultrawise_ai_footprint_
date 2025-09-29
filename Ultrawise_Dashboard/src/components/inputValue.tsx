"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { calculateVolume } from "@/lib/calculateVolume";

type ControlledModalProps = {
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>
  radius:number | null
  setRadius: React.Dispatch<React.SetStateAction<number | null>>
  volume:number 
  setvolume: React.Dispatch<React.SetStateAction<number>>
  height:number 
  setheight: React.Dispatch<React.SetStateAction<number>>
};

export default function ControlledModal({open,setopen,radius,setRadius,volume,setvolume,height, setheight} : ControlledModalProps) {
  // const [volume,setvolume] = useState(0)
  // const [height, setheight] = useState(0)
  const save = () => {
    const radius = calculateVolume(volume,height)
    setRadius(radius)
    setopen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setopen}>
      <Dialog.Trigger asChild>
        <button
          onClick={() => setopen(true)}
          className="px-4 py-2  mt-2  bg-[#020817] text-white rounded"
        >
          Change Tank Dimensions
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[400px] max-w-[90%] 
                     -translate-x-1/2 -translate-y-1/2 
                     bg-[#0D1526] p-6 rounded-lg shadow-lg"
        >
          <Dialog.Title className="text-lg font-bold">Input Tank Dimensions</Dialog.Title>
          <Dialog.Description className="mt-2 text-white">
              <form action="" method="post" className="">
                  <div className="my-2">
                    <p className="ml-2">volume(m<sup>3</sup>)</p>
                    <input type="number" placeholder="Volume" className=" p-2 rounded-sm" value={volume} onChange={(e) => setvolume(Number(e.target.value))}/>
                  </div>
                  <div className="my-2">
                      <p className="ml-2">height</p>
                      <input type="number" placeholder="height"className=" p-2 rounded-sm" value={height} onChange={(e) => setheight(Number(e.target.value))}/>
                  </div>
              </form>
          </Dialog.Description>

          <div className="mt-4">
            <button
              onClick={() => save()}
              className="px-4 py-2 bg-[#ff3333] text-white rounded"
            >
              Save Dimensions
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
