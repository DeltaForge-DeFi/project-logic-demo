export const DS_PROXY_ABI = [
  "function execute(bytes memory _code, bytes memory _data) public payable returns (address target, bytes memory response)",
  "function execute(address _target, bytes memory _data) public payable returns (bytes memory response)",
  "function owner() public view returns (address)",
  "function cache() public view returns (address)",
] as const;
