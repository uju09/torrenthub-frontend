import { useState } from 'react';
import {
  ShieldCheck,
  ShieldX,
  Lock,
  Unlock,
  Search,
  Loader2,
  Copy,
  Check,
  Wallet,
  AlertCircle,
  Key,
  ClipboardCheck,
  ArrowLeft,
  CircleCheck,
  CircleX,
  AlertTriangle,
  Clock,
  Coins,
  Send,
  User,
  FileText
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Expected values from environment
const EXPECTED_RECEIVER = import.meta.env.VITE_EXPECTED_RECEIVER;
const EXPECTED_SOL = parseFloat(import.meta.env.VITE_EXPECTED_SOL) || 1;
const DECRYPT_KEY = import.meta.env.VITE_DECRYPT_KEY;

const PaymentVerification = () => {
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const verifyPayment = async () => {
    if (!signature.trim()) {
      setError('Please enter a transaction signature');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/solana/transaction/${signature.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transaction');
      }

      // Verify if receiver matches AND amount is >= expected
      const receiverValid = data.receiver === EXPECTED_RECEIVER;
      const amountValid = data.amountSol >= EXPECTED_SOL;
      const isValid = receiverValid && amountValid;

      setResult({
        ...data,
        isValid,
        receiverValid,
        amountValid,
        expectedReceiver: EXPECTED_RECEIVER,
        expectedSol: EXPECTED_SOL,
      });
    } catch (err) {
      setError(err.message || 'Failed to verify transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyPayment();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-6 md:p-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lock className="w-12 h-12 text-[#ccff00]" />
          <h1 className="text-4xl md:text-6xl font-bold text-[#ccff00]">
            PAYMENT VERIFICATION
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Verify your Solana transaction to unlock access
        </p>
      </div>

      {/* Verification Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900 border-4 border-[#00ffff] p-6 shadow-[8px_8px_0px_0px_#fff]">
          {/* Required Payment Info */}
          <div className="mb-6 p-4 bg-black/50 border border-gray-700">
            <h3 className="text-[#ff00ff] font-bold mb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              REQUIRED PAYMENT
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Amount:
                </span>
                <span className="text-[#ccff00] font-bold">{EXPECTED_SOL} SOL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send to:
                </span>
                <span className="text-[#00ffff] font-mono text-xs break-all mt-1">{EXPECTED_RECEIVER}</span>
              </div>
            </div>
          </div>

          {/* Transaction Signature Input */}
          <div className="mb-6">
            <label className="block text-[#00ffff] text-sm font-bold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              TRANSACTION SIGNATURE
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your Solana transaction signature..."
              className="w-full bg-black border-2 border-gray-600 text-white p-3 font-mono text-sm focus:border-[#ccff00] focus:outline-none transition-colors"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={verifyPayment}
            disabled={loading}
            className={`w-full py-4 font-bold text-lg border-2 border-black transition-all flex items-center justify-center gap-2 ${loading
              ? 'bg-gray-600 text-gray-300 cursor-wait'
              : 'bg-[#ccff00] text-black hover:bg-[#ff00ff] hover:text-white'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                VERIFYING...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                VERIFY PAYMENT
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border-2 border-red-500 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className={`mt-8 bg-zinc-900 border-4 p-6 shadow-[8px_8px_0px_0px_#fff] ${result.isValid ? 'border-[#ccff00]' : 'border-red-500'
            }`}>
            {/* Status Banner */}
            <div className={`text-center py-4 mb-6 border-2 flex items-center justify-center gap-3 ${result.isValid
              ? 'bg-[#ccff00]/20 border-[#ccff00] text-[#ccff00]'
              : 'bg-red-900/30 border-red-500 text-red-400'
              }`}>
              {result.isValid ? (
                <ShieldCheck className="w-8 h-8" />
              ) : (
                <ShieldX className="w-8 h-8" />
              )}
              <span className="text-3xl font-bold">
                {result.isValid ? 'PAYMENT VERIFIED' : 'PAYMENT INVALID'}
              </span>
            </div>

            {/* Validation Summary */}
            <div className="mb-6 p-4 bg-black/50 border border-gray-700">
              <h3 className="text-[#ff00ff] font-bold mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                VALIDATION CHECKS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Receiver Address:
                  </span>
                  <span className={`flex items-center gap-1 ${result.receiverValid ? 'text-[#ccff00]' : 'text-red-400'}`}>
                    {result.receiverValid ? (
                      <><CircleCheck className="w-4 h-4" /> MATCHED</>
                    ) : (
                      <><CircleX className="w-4 h-4" /> MISMATCH</>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Amount ({result.expectedSol} SOL required):
                  </span>
                  <span className={`flex items-center gap-1 ${result.amountValid ? 'text-[#ccff00]' : 'text-red-400'}`}>
                    {result.amountValid ? (
                      <><CircleCheck className="w-4 h-4" /> SUFFICIENT</>
                    ) : (
                      <><CircleX className="w-4 h-4" /> INSUFFICIENT</>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 text-sm">
              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Amount Sent:
                </span>
                <span className={`font-bold text-lg ${result.amountValid ? 'text-[#ccff00]' : 'text-red-400'}`}>
                  {result.amountSol} SOL
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Expected Amount:
                </span>
                <span className="text-[#00ffff] font-bold text-lg">{result.expectedSol} SOL</span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sender:
                </span>
                <span className="text-white font-mono text-xs break-all">{result.sender}</span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Receiver:
                </span>
                <span className={`font-mono text-xs break-all ${result.receiverValid ? 'text-[#ccff00]' : 'text-red-400'
                  }`}>
                  {result.receiver}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Expected Receiver:
                </span>
                <span className="text-[#00ffff] font-mono text-xs break-all">{result.expectedReceiver}</span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Fee:
                </span>
                <span className="text-white">{result.fee} SOL</span>
              </div>

              {result.isSelfTransfer && (
                <div className="text-center py-2 bg-yellow-900/30 border border-yellow-500 text-yellow-400 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Self-transfer detected
                </div>
              )}

              {result.blockTime && (
                <div className="flex flex-col md:flex-row md:justify-between pb-2">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time:
                  </span>
                  <span className="text-white">{new Date(result.blockTime * 1000).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Action based on validity */}
            {result.isValid && (
              <div className="mt-6">
                {!showKey ? (
                  <button
                    onClick={() => setShowKey(true)}
                    className="w-full py-4 bg-[#ff00ff] text-white text-center font-bold text-lg border-2 border-black hover:bg-[#ccff00] hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key className="w-6 h-6" />
                    GET DECRYPT KEY
                  </button>
                ) : (
                  <div className="bg-black border-2 border-[#ccff00] p-4">
                    <div className="text-center mb-3 flex items-center justify-center gap-2">
                      <Unlock className="w-5 h-5 text-[#ccff00]" />
                      <span className="text-[#ccff00] font-bold">YOUR DECRYPT KEY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={DECRYPT_KEY}
                        readOnly
                        className="flex-1 bg-zinc-900 border border-gray-600 text-[#00ffff] p-3 font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(DECRYPT_KEY);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className={`px-4 py-3 font-bold border-2 border-black transition-colors flex items-center gap-2 ${copied
                          ? 'bg-[#ccff00] text-black'
                          : 'bg-[#ff00ff] text-white hover:bg-[#ccff00] hover:text-black'
                          }`}
                      >
                        {copied ? (
                          <><Check className="w-5 h-5" /> COPIED!</>
                        ) : (
                          <><Copy className="w-5 h-5" /> COPY</>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs text-center mt-3">
                      Save this key to decrypt your files
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-gray-400 hover:text-[#ccff00] transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;
