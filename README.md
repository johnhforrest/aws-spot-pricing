# About
This was a take-home project that I did for an anonymous company several years ago. It calculates the optimal price of a cluster of AWS EC2 instances based on hardware requirements (vCPUs, RAM, disk space) and historical spot instance prices. Using spot instances like this for on-demand computing can lead to significant savings as prices will fluctuate based on current demand in various AWS regions.

# Notes
- Scaffolded from https://github.com/iiegor/generator-react-webpack-node

# To do
- Add time ranges for the spot price history request
- Remove requirement on all instance fields (i.e., we should be able to require 32 GB of memory and nothing else)
- Convert server code to ES6, and enable eslint
- Handle edge cases (e.g., API failed)
- Add test framework and CI

# Thoughts
- Could add caching around the AWS query if the timerange for spot prices isn't changing drastically
- The way we do the AWS query right now is a little inefficient (e.g., 1 API call for each availability zone). We can filter by instance type from the EC2 instances and might be able to get this down to 1 API call or at most 2 (each API call can return up to 1000 instances).
