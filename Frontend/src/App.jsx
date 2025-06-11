import React from 'react';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold underline mb-4">Hello world!</h1>
      
      {/* DaisyUI Button */}
      <button className="btn btn-primary">Primary Button</button>
      
      {/* DaisyUI Card */}
      <div className="card w-96 bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>This is a DaisyUI component working with Tailwind CSS.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;