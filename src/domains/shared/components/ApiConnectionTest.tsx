'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'testing';
  message: string;
  timestamp?: Date;
}

const ApiConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'testing',
    message: 'Testing connection...'
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus({
        status: 'testing',
        message: 'Testing connection...'
      });

      // Test basic health endpoint
      const response = await api.get('/health');
      
      if (response.success) {
        setConnectionStatus({
          status: 'connected',
          message: 'API connection successful',
          timestamp: new Date()
        });
      } else {
        throw new Error(`API returned success: false`);
      }
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      setConnectionStatus({
        status: 'disconnected',
        message: error instanceof Error ? error.message : 'Connection failed',
        timestamp: new Date()
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      case 'testing':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '❌';
      case 'testing':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">API Connection Test</h3>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{getStatusIcon()}</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {connectionStatus.message}
        </span>
      </div>

      {connectionStatus.timestamp && (
        <p className="text-sm text-gray-500 mb-3">
          Last tested: {connectionStatus.timestamp.toLocaleString()}
        </p>
      )}

      <button
        onClick={testConnection}
        disabled={connectionStatus.status === 'testing'}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {connectionStatus.status === 'testing' ? 'Testing...' : 'Test Again'}
      </button>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p className="font-medium mb-1">Backend Configuration:</p>
        <p>Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
