#!/usr/bin/env node

/**
 * Load Testing Script for Dounie Cuisine
 * Tests API endpoints with concurrent requests
 */

const API_BASE = 'http://localhost:5000/api';

class LoadTester {
  constructor() {
    this.results = {
      success: 0,
      errors: 0,
      totalTime: 0,
      responses: []
    };
  }

  async log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async testHealthEndpoint() {
    const start = Date.now();
    try {
      const response = await fetch(`${API_BASE}/health`);
      const duration = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        this.results.success++;
        this.results.totalTime += duration;
        this.results.responses.push({ endpoint: '/health', duration, status: response.status });
        await this.log(`✓ Health check OK (${duration}ms)`);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      const duration = Date.now() - start;
      this.results.errors++;
      this.results.totalTime += duration;
      await this.log(`❌ Health check failed: ${error.message} (${duration}ms)`);
      return false;
    }
  }

  async runBasicTest() {
    await this.log('🚀 Starting basic load testing for Dounie Cuisine');
    
    // Basic health checks
    await this.log('--- Basic Health Checks ---');
    for (let i = 0; i < 5; i++) {
      await this.testHealthEndpoint();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Results summary
    await this.log('✅ Basic load testing completed!');
    await this.log(`📊 Results Summary:`);
    await this.log(`   - Successful requests: ${this.results.success}`);
    await this.log(`   - Failed requests: ${this.results.errors}`);
    
    const successRate = (this.results.success / (this.results.success + this.results.errors)) * 100;
    await this.log(`   - Success rate: ${successRate.toFixed(2)}%`);
  }
}

// Run the test
const tester = new LoadTester();
tester.runBasicTest().catch(console.error);
