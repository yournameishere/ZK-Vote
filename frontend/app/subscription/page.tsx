"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/components/WalletProvider";
import { prepareSubscribePremium, prepareCancelSubscription } from "@/lib/aleo-contracts";
import { Subscription } from "@/lib/types";

export default function SubscriptionPage() {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && wallet) {
      loadSubscription();
    }
  }, [connected, wallet]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      // In production, this would query the subscription contract
      // For now, default to free tier
      setSubscription({
        user: wallet?.address || "",
        tier: "free",
        startTime: 0,
        endTime: 0,
        active: false,
      });
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribePremium = async (durationDays: number) => {
    if (!connected || !wallet) return;

    try {
      setSubscribing(true);
      setError(null);
      
      // Prepare subscription transaction
      const subscribeCall = prepareSubscribePremium(wallet.address, durationDays);
      
      // Note: In production, this would execute through Puzzle Wallet
      // The wallet would show a popup for signing
      
      // Simulate subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload subscription
      await loadSubscription();
    } catch (err: any) {
      setError(err.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  const cancelSubscription = async () => {
    if (!connected || !wallet) return;

    try {
      setSubscribing(true);
      setError(null);
      
      // Prepare cancellation transaction
      const cancelCall = prepareCancelSubscription(wallet.address);
      
      // Note: In production, this would execute through Puzzle Wallet
      
      // Simulate cancellation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reload subscription
      await loadSubscription();
    } catch (err: any) {
      setError(err.message || "Failed to cancel subscription");
    } finally {
      setSubscribing(false);
    }
  };

  if (!connected || !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Puzzle Wallet to manage your subscription.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.tier === "premium" && subscription?.active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Plans</h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subscription...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className={`bg-white rounded-xl p-8 border-2 shadow-lg transition-all ${
              !isPremium ? "border-primary-500" : "border-gray-200"
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Free</h2>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Basic elections</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Simple eligibility rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Public results</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Unlimited elections</span>
                </li>
              </ul>
              {!isPremium && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-primary-800 font-semibold">Current Plan</p>
                </div>
              )}
            </div>

            {/* Premium Tier */}
            <div className={`bg-white rounded-xl p-8 border-2 shadow-lg transition-all relative ${
              isPremium ? "border-primary-500" : "border-gray-200"
            }`}>
              {isPremium && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Active
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium</h2>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                $9.99<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Advanced eligibility rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Detailed analytics dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Custom branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Priority support</span>
                </li>
              </ul>
              {isPremium ? (
                <button
                  onClick={cancelSubscription}
                  disabled={subscribing}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {subscribing ? "Cancelling..." : "Cancel Subscription"}
                </button>
              ) : (
                <button
                  onClick={() => subscribePremium(30)}
                  disabled={subscribing}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {subscribing ? "Subscribing..." : "Subscribe to Premium"}
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Why Premium?
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            Premium features help you run more sophisticated elections with better insights and customization options.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>Advanced eligibility rules for complex voting scenarios</li>
            <li>Analytics to understand voter participation patterns</li>
            <li>Custom branding to match your organization's identity</li>
            <li>Priority support for faster issue resolution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
