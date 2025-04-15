import React, { useRef, useEffect } from 'react';

interface ECGDiagramProps {
    ecgData: string[];
}

const ECGDiagram: React.FC<ECGDiagramProps> = ({ ecgData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Convert and filter the numeric values
    const numericArray = ecgData
        .join(',')               
        .replace(/[\[\]']+/g, '') 
        .split(',')
        .map(Number)
        .filter(val => !isNaN(val));

    const hasValidData = numericArray.length > 0;

    useEffect(() => {
        if (!canvasRef.current || !hasValidData) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = 800;
        const height = 200;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

       // ECG waveform
        const points = numericArray.slice(0, 800);
        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = max - min || 1;

        ctx.beginPath();
        ctx.strokeStyle = "#000000"; // ← Black color
        ctx.lineWidth = 1.5;

        points.forEach((value, index) => {
            const x = (index / points.length) * width;
            const y = height - ((value - min) / range) * height;

            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

    }, [hasValidData, ecgData]);

    if (!hasValidData) {
        return (
            <div className="text-center text-gray-400 italic mt-6">
                No ECG data available to display.
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh] bg-[#212121] p-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg w-[850px]">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">ECG Diagram</h2>
                <canvas ref={canvasRef} className="w-full rounded-md shadow" />
            </div>
        </div>
    );
};

export default ECGDiagram;
