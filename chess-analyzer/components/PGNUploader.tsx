'use client';

import { useState } from 'react';

interface PGNUploaderProps {
  onPGNLoad: (pgn: string) => void;
}

export default function PGNUploader({ onPGNLoad }: PGNUploaderProps) {
  const [pgnText, setPgnText] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');

  const handlePaste = () => {
    if (pgnText.trim()) {
      onPGNLoad(pgnText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onPGNLoad(content);
        setPgnText(content);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleGame = () => {
    const samplePGN = `[Event "Sample Game"]
[Site "Online"]
[Date "2024.01.01"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 
14. Ng3 g6 15. a4 c5 16. d5 c4 17. Bg5 h6 18. Be3 Nc5 19. Qd2 h5 
20. Bh6 Bxh6 21. Qxh6 Qf8 22. Qd2 Qg7 23. axb5 axb5 24. Rxa8 Rxa8 
25. Nh4 Kh7 26. Nhf5 gxf5 27. Nxf5 Qf8 28. Qg5 Rg8 29. Qh6+ Kg6 
30. Qh4 Kh7 31. Re3 Nfd7 32. Rg3 Rxg3 33. Qxg3 Qg8 34. Qh4+ Kg6 
35. Nh6 1-0`;
    
    setPgnText(samplePGN);
    onPGNLoad(samplePGN);
  };

  return (
    <div className="bg-[#262421] rounded-lg p-4">
      <h2 className="text-white font-bold mb-3">📤 Upload Game</h2>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${
            activeTab === 'paste'
              ? 'bg-[#81b64c] text-white'
              : 'bg-[#3d3d3d] text-gray-400 hover:bg-[#4a4a4a]'
          }`}
        >
          Paste PGN
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${
            activeTab === 'file'
              ? 'bg-[#81b64c] text-white'
              : 'bg-[#3d3d3d] text-gray-400 hover:bg-[#4a4a4a]'
          }`}
        >
          Upload File
        </button>
      </div>

      {/* Content */}
      {activeTab === 'paste' ? (
        <div className="space-y-3">
          <textarea
            value={pgnText}
            onChange={(e) => setPgnText(e.target.value)}
            placeholder="Paste your PGN here...&#10;&#10;Example:&#10;1. e4 e5 2. Nf3 Nc6..."
            className="w-full h-32 bg-[#1a1a1a] text-gray-200 border border-[#3d3d3d] rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#81b64c] font-mono text-sm"
          />
          <button
            onClick={handlePaste}
            className="w-full bg-[#81b64c] hover:bg-[#72a642] text-white font-bold py-2 px-4 rounded transition-all"
          >
            Load PGN
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-[#3d3d3d] rounded p-6 text-center hover:border-[#81b64c] transition-all">
            <input
              type="file"
              accept=".pgn"
              onChange={handleFileUpload}
              className="hidden"
              id="pgn-file-input"
            />
            <label
              htmlFor="pgn-file-input"
              className="cursor-pointer block"
            >
              <div className="text-3xl mb-2">📁</div>
              <p className="text-gray-400 text-sm">Click to upload PGN file</p>
            </label>
          </div>
        </div>
      )}

      {/* Sample Game Button */}
      <div className="mt-3 pt-3 border-t border-[#3d3d3d]">
        <button
          onClick={loadSampleGame}
          className="w-full bg-[#3d3d3d] hover:bg-[#4a4a4a] text-gray-300 font-medium py-2 px-3 rounded transition-all text-sm"
        >
          🎮 Load Sample Game
        </button>
      </div>
    </div>
  );
}
