"use client";

import { useState, useEffect } from "react";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function Home() {
  const [realvalue, setRealValue] = useState<number[]>([-50, -50, 0, 50, 100]);
  const [labels, setLabels] = useState<number[]>([-50, -50, 0, 50, 100]);
  const [disvalue, setDisvalue] = useState<number | 0>(0); // State for displayed value
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mousedisval, setMouseDisVal] = useState<number | 0>(0); // State for displayed value

  useEffect(() => {
    const ctx = document.getElementById('plChart') as HTMLCanvasElement;

    // Create datasets for below and above zero
    const belowZeroData = realvalue.map(value => (value < 0 ? value : 0));
    const aboveZeroData = realvalue.map(value => (value > 0 ? value : 0));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Loss Area',
            data: belowZeroData,
            borderColor: 'red',
            fill: true,
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red area for losses
            pointRadius: 0,
            // pointBackgroundColor: (context) => {
            //   const index = context.dataIndex;
            //   const value = realvalue[index];
            //   return value === 1000 ? 'red' : value === 0 ? 'black' : 'red';
            // },
            // pointBorderColor: 'transparent',
          },
          {
            label: 'Profit Area',
            data: aboveZeroData,
            borderColor: 'green',
            fill: true,
            backgroundColor: 'rgba( 0, 255, 0, 0.2)',
            pointBorderColor: 'transparent',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false, // Set to false to allow negative values
            min: -100, // Minimum value for the Y-axis
            max: 100, // Maximum value for the Y-axis
            ticks: {
              callback: (value) => value === 0 ? '0' : value,
              display: false // Change to true to display ticks
            }
          },
          x: {
            title: {
              text: 'MEOW Price at Exp ($)'
            },
            ticks: {
              display: false
            }
          }
        },
      }
    });

    return () => {
      chart.destroy(); // Clean up the chart instance on component unmount
    };
  }, [realvalue, labels]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (mousePosition.x >= 520 && mousePosition.x <= 960) {
      setDisvalue(parseFloat((200 * (mousePosition.x - 666) / (1240 - 666) - 237).toFixed(2)));
    } else if (mousePosition.x > 960) {
      setDisvalue(parseFloat((1000 * (mousePosition.x - 960) / (1818 - 960)).toFixed(2)));
      if (mousePosition.x >= 1818) {
        setDisvalue(1000);
      }
    } else if (mousePosition.x < 520) {
      setDisvalue(-200);
    }
  }, [mousePosition.x]);

  useEffect(() => {
    console.log("disvadfasdf", disvalue);
    if (disvalue >= -200 || disvalue <= 0) {
      setMouseDisVal(parseFloat((2 * (disvalue + 200) / 237 + 237).toFixed(2)));
    }
    if ( disvalue > 0){
      setMouseDisVal(parseFloat(((500 -239) * disvalue / 1000 + 239).toFixed(2)));
    }
  });
  console.log("ddddddddddd", mousePosition.x);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mt-10 mb-3">
        <p className="text-xl text-gray-400 mb-2">Expecter Profit & Loss</p>
        {disvalue !== null ? (
          disvalue >= 0 ? (
            disvalue === 1000 ? (
              <p className="text-green-500 font-bold text-3xl">Unlimited</p>
            ) : (
              disvalue === 0 ? (
                <p className="text-green-500 font-bold text-3xl">$0</p>
              ) : (
                <p className="text-green-500 font-bold text-3xl">+${disvalue}</p>
              )
            )
          ) : (
            <p className="text-red-500 font-bold text-3xl">-${disvalue * -1}</p>
          )
        ) : (
          'Hover over the chart'
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '14%', // Center vertically
          left: mousePosition.x - 80,
        }}
      >
        <p className="text-xl text-gray-400">MEOW Price at Exp</p>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '18%', // Center vertically
          left: mousePosition.x,
        }}
      >
        <p className="font-semibold text-xl">{ mousedisval > 497 ? 'unlimited' : mousedisval }</p>
      </div>
      <canvas id="plChart" width="300" height="100"></canvas>
      <div className="flex gap-10">
        {disvalue > 0 ? (
          <>
            <div className="text-2xl font-medium">Max Loss</div>
            <div className="text-2xl font-medium">Breakeven</div>
            {disvalue === 1000 ? (
              <div className="text-2xl font-bold">Max Profit</div>
            ) : (
              <div className="text-2xl font-medium">Max Profit</div>
            )}
          </>
        ) : (
          <>
            {disvalue === 0 ? (
              <>
                <div className="text-2xl font-medium">Max Loss</div>
                <div className="text-2xl font-bold">Breakeven</div>
                <div className="text-2xl font-medium">Max Profit</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">Max Loss</div>
                <div className="text-2xl text-gray-300 font-medium">Breakeven</div>
                <div className="text-2xl text-gray-300 font-medium">Max Profit</div>
              </>
            )}
          </>
        )}
      </div>
      { (disvalue <= -120 && disvalue >= -140) ? (
        <div
          style={{
            position: 'absolute',
            left: '49.4%', // Center the circle horizontally
            top: '49.5%', // Adjust as needed to align with the X-axis
            width: '30px', // Diameter of the outer circle
            height: '30px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'black'
          }}
        /> 
      ): (
        <div
          style={{
            position: 'absolute',
            left: '49.6%', // Center the circle horizontally
            top: '50.4%', // Adjust as needed to align with the X-axis
            width: '20px', // Diameter of the outer circle
            height: '20px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'black'
          }}
        /> 
      )}
      { (mousePosition.x < 530 && mousePosition.x >= 510) ? (
        <div
          style={{
            position: 'absolute',
            left: '26.5%', // Center the circle horizontally
            top: '65%', // Adjust as needed to align with the X-axis
            width: '30px', // Diameter of the outer circle
            height: '30px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'red'
          }}
        />
      ): (
        <div
          style={{
            position: 'absolute',
            left: '26.8%', // Center the circle horizontally
            top: '65%', // Adjust as needed to align with the X-axis
            width: '20px', // Diameter of the outer circle
            height: '20px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'red'
          }}
        />
      )}
      { (disvalue <= 1000 && disvalue >= 980) ? (
        <div
          style={{
            position: 'absolute',
            left: '94.8%', // Center the circle horizontally
            top: '20.5%', // Adjust as needed to align with the X-axis
            width: '30px', // Diameter of the outer circle
            height: '30px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'green'
          }}
        />
      ):
      (
        <div
          style={{
            position: 'absolute',
            left: '94.8%', // Center the circle horizontally
            top: '20.8%', // Adjust as needed to align with the X-axis
            width: '20px', // Diameter of the outer circle
            height: '20px', // Diameter of the outer circle
            borderRadius: '50%',
            display: 'flex', // Use flex to center the inner circle
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            backgroundColor: 'green'
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: mousePosition.x - 50, // Center the circle horizontally
          top: '46%', // Adjust as needed to align with the X-axis
          width: '100px', // Diameter of the outer circle
          height: '100px', // Diameter of the outer circle
          borderRadius: '50%', // Make it a circle
          border: '2px solid green', // Border style
          opacity: '80%',
          display: 'flex', // Use flex to center the inner circle
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
        }}
      >
        <div
          style={{
            width: '50px', // Diameter of the inner circle
            height: '50px', // Diameter of the inner circle
            borderRadius: '50%', // Make it a circle
            backgroundColor: 'green', // Color of the inner circle
            opacity: '80%',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '51%', // Center vertically
          left: mousePosition.x,
          width: '2px', // Width of the bar
          height: '59%', // Full height
          backgroundColor: 'black', // Color of the bar
          transform: 'translateY(-50%)', // Center the bar
        }}
      />
    </div>
  );
}