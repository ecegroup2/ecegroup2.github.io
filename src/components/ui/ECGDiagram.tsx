import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";

interface ECGDiagramProps {
    ecgData: string[]; 
}

const config = {
    graphWidth: 800,
    graphHeight: 200,
    lineColor: '#000',
    lineWidth: 1.5,
    backgroundColor: '#f8f9fa',
    gridColor: '#e0e0e0',
    pointsToShow: 800, // show more points to fill canvas
    verticalScale: 10, // adjust this to make waveform look nice
};

// const ECGDiagram: React.FC<ECGDiagramProps> = () => {
    const ECGDiagram: React.FC<ECGDiagramProps> = ({ ecgData })   =>{
    console.log('in child',ecgData)
    
    // Step 1: Remove the square brackets and single quotes
    const cleanedString = ecgData.join(',').replace(/[\[\]']/g, "");

    // Step 2: Split the string into an array based on the commas
    const stringArray = cleanedString.split(",");

    // Step 3: Convert each string to a number
    const numericArray = stringArray.map(value => Number(value));

    // Output the numeric array
    console.log('new array to plot',numericArray);

    
    
    
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        initCanvas(canvas, ctx);
        drawECG(canvas,ctx);
    }, []);

    const initCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        canvas.width = config.graphWidth;
        canvas.height = config.graphHeight;
        canvas.style.backgroundColor = config.backgroundColor;
        drawGrid(ctx);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, config.graphWidth, config.graphHeight);
        ctx.strokeStyle = config.gridColor;
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= config.graphWidth; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, config.graphHeight);
            ctx.stroke();
        }

        for (let y = 0; y <= config.graphHeight; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(config.graphWidth, y);
            ctx.stroke();
        }
    };

    const drawECG = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        const points = numericArray.slice(0, config.pointsToShow);
        const maxY = Math.max(...points);
        const minY = Math.min(...points);
        const paddingY = 0.1 * (maxY - minY); // 10% vertical padding
        const adjustedMax = maxY + paddingY;
        const adjustedMin = minY - paddingY;
        const rangeY = adjustedMax - adjustedMin;
    
        ctx.beginPath();
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;
    
        const xScale = config.graphWidth / (points.length - 1);
    
        points.forEach((value, index) => {
            const x = index * xScale;
            const y = config.graphHeight - ((value - adjustedMin) / rangeY) * config.graphHeight;
    
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
    
        ctx.stroke();
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'ecg-diagram.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };
    
    
   
return (
    <div className="flex items-center justify-center rounded-lg min-h-[50vh] bg-[#212121]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="border border-gray-300 rounded-2xl shadow-xl p-6 bg-[#f8f9fa] text-center w-[850px]">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">ECG Diagram</h1>
            <canvas ref={canvasRef} className="mb-6 w-full rounded-md shadow-sm" />
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadImage}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
                ⬇️ Download ECG Image
            </motion.button>
        </div>
    </div>
);

    
    
};

export default ECGDiagram;