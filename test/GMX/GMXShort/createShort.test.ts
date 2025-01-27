import { expect } from "chai";
import { ethers as hardhatEthers } from "hardhat";
import { parseUnits, ZeroAddress } from "ethers";
import {
  CreateShort,
  MockERC20,
  MockExchangeRouter,
  MockReader,
  MockUniswapSwap
} from "../../../typechain-types";

describe("CreateShort Contract", function () {
  let createShort: CreateShort;
  let usdc: MockERC20;
  let weth: MockERC20;
  let mockMarket: any;
  let mockExchangeRouter: MockExchangeRouter;
  let mockReader: MockReader;
  let uniswapSwap: MockUniswapSwap;
  let owner: any;
  let user: any;
  let otherUser: any;

  beforeEach(async function() {
    [owner, user, otherUser] = await hardhatEthers.getSigners();
  
    // Deploy mock tokens
    const MockERC20 = await hardhatEthers.getContractFactory("MockERC20");
    usdc = await MockERC20.deploy("Mock USDC", "USDC", 6);
    weth = await MockERC20.deploy("Mock WETH", "WETH", 18);
    await usdc.waitForDeployment();
    await weth.waitForDeployment();
  
    // Deploy mock contracts
    const MockMarket = await hardhatEthers.getContractFactory("MockMarket");
    mockMarket = await MockMarket.deploy();
    
    const MockExchangeRouterFactory = await hardhatEthers.getContractFactory("MockExchangeRouter");
    mockExchangeRouter = await MockExchangeRouterFactory.deploy();
    
    const MockReaderFactory = await hardhatEthers.getContractFactory("MockReader");
    mockReader = await MockReaderFactory.deploy(mockMarket.target);

    // Deploy UniswapSwap mock
    const MockUniswapSwapFactory = await hardhatEthers.getContractFactory("MockUniswapSwap");
    uniswapSwap = await MockUniswapSwapFactory.deploy();
    
    // Deploy CreateShort
    const createShortFactory = await hardhatEthers.getContractFactory("CreateShort");
    createShort = await createShortFactory.deploy();

    await Promise.all([
      mockMarket.waitForDeployment(),
      mockExchangeRouter.waitForDeployment(),
      mockReader.waitForDeployment(),
      uniswapSwap.waitForDeployment(),
      createShort.waitForDeployment()
    ]);

    await usdc.mint(uniswapSwap.target, parseUnits("10000", 6)); // Даем USDC мок-свопу
  });

  describe("Short Position Management", function () {
    it("should create a short position", async function () {
      const wethAmount = parseUnits("1", 18);
      const sizeDeltaUsd = parseUnits("1000", 30);
      
      // Подготовка параметров
      const params = {
        user: user.address,
        market: mockMarket.target,
        sizeDeltaUsd: sizeDeltaUsd,
        wethAmount: wethAmount,
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        WETH: weth.target,
        uniswapSwap: uniswapSwap.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      // Mint and approve WETH
      await weth.mint(user.address, wethAmount);
      await weth.connect(user).approve(createShort.target, wethAmount);

      // Encode parameters
      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
        [[
          params.user,
          params.market,
          params.sizeDeltaUsd,
          params.wethAmount,
          params.exchangeRouter,
          params.reader,
          params.USDC,
          params.WETH,
          params.uniswapSwap,
          params.orderVaultAddress,
          params.dataStoreAddress,
          params.routerAddress
        ]]
      );

      await expect(
        createShort.connect(user).createShort(encodedParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.emit(createShort, "PositionCreated");

      const position = await createShort.userPositions(user.address);
      expect(position.isActive).to.be.true;
    });

    it("should withdraw a short position", async function () {
      const wethAmount = parseUnits("1", 18);
      const sizeDeltaUsd = parseUnits("1000", 30);
      
      // Подготовка параметров
      const params = {
        user: user.address,
        market: mockMarket.target,
        sizeDeltaUsd: sizeDeltaUsd,
        wethAmount: wethAmount,
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        WETH: weth.target,
        uniswapSwap: uniswapSwap.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      // Mint and approve WETH
      await weth.mint(user.address, wethAmount);
      await weth.connect(user).approve(createShort.target, wethAmount);

      // Encode parameters
      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
        [[
          params.user,
          params.market,
          params.sizeDeltaUsd,
          params.wethAmount,
          params.exchangeRouter,
          params.reader,
          params.USDC,
          params.WETH,
          params.uniswapSwap,
          params.orderVaultAddress,
          params.dataStoreAddress,
          params.routerAddress
        ]]
      );

      await expect(
        createShort.connect(user).createShort(encodedParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.emit(createShort, "PositionCreated");

      const position = await createShort.userPositions(user.address);
      expect(position.isActive).to.be.true;

      const withdrawParams = {
        user: user.address,
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      const encodedWithdrawParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,address,address,address,address,address)"],
        [[
          withdrawParams.user,
          withdrawParams.exchangeRouter,
          withdrawParams.reader,
          withdrawParams.USDC,
          withdrawParams.orderVaultAddress,
          withdrawParams.dataStoreAddress,
          withdrawParams.routerAddress
        ]]
      );

      await expect(
        createShort.connect(user).withdrawShort(encodedWithdrawParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.emit(createShort, "PositionClosed");

      const positionAfterWithdraw = await createShort.userPositions(user.address);
      expect(positionAfterWithdraw.isActive).to.be.false;
    });
  });

  describe("Revert Cases", function () {
    it("should revert when creating position with zero WETH amount", async function () {
      const params = {
        user: user.address,
        market: mockMarket.target,
        sizeDeltaUsd: parseUnits("1000", 30),
        wethAmount: 0, // Zero amount
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        WETH: weth.target,
        uniswapSwap: uniswapSwap.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
        [[params.user, params.market, params.sizeDeltaUsd, params.wethAmount, params.exchangeRouter, params.reader, 
          params.USDC, params.WETH, params.uniswapSwap, params.orderVaultAddress, params.dataStoreAddress, params.routerAddress]]
      );

      await expect(
        createShort.connect(user).createShort(encodedParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.be.revertedWith("collateral must be more than 0");
    });

    it("should revert when creating position with zero execution fee", async function () {
      const params = {
        user: user.address,
        market: mockMarket.target,
        sizeDeltaUsd: parseUnits("1000", 30),
        wethAmount: parseUnits("1", 18),
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        WETH: weth.target,
        uniswapSwap: uniswapSwap.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      await weth.mint(user.address, params.wethAmount);
      await weth.connect(user).approve(createShort.target, params.wethAmount);

      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
        [[params.user, params.market, params.sizeDeltaUsd, params.wethAmount, params.exchangeRouter, params.reader, 
          params.USDC, params.WETH, params.uniswapSwap, params.orderVaultAddress, params.dataStoreAddress, params.routerAddress]]
      );

      await expect(
        createShort.connect(user).createShort(encodedParams, {
          value: 0 // Zero execution fee
        })
      ).to.be.revertedWith("fee must be more than 0");
    });

    it("should revert when withdrawing without active position", async function () {
      const withdrawParams = {
        user: user.address,
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      const encodedWithdrawParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,address,address,address,address,address)"],
        [[withdrawParams.user, withdrawParams.exchangeRouter, withdrawParams.reader, withdrawParams.USDC,
          withdrawParams.orderVaultAddress, withdrawParams.dataStoreAddress, withdrawParams.routerAddress]]
      );

      await expect(
        createShort.connect(user).withdrawShort(encodedWithdrawParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.be.revertedWith("No active position");
    });

    it("should revert when creating second position while one is active", async function () {
      // First create a position
      const params = {
        user: user.address,
        market: mockMarket.target,
        sizeDeltaUsd: parseUnits("1000", 30),
        wethAmount: parseUnits("1", 18),
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        WETH: weth.target,
        uniswapSwap: uniswapSwap.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      await weth.mint(user.address, params.wethAmount * BigInt(2)); // Mint enough for two positions
      await weth.connect(user).approve(createShort.target, params.wethAmount * BigInt(2));

      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
        [[params.user, params.market, params.sizeDeltaUsd, params.wethAmount, params.exchangeRouter, params.reader, 
          params.USDC, params.WETH, params.uniswapSwap, params.orderVaultAddress, params.dataStoreAddress, params.routerAddress]]
      );

      // Create first position
      await createShort.connect(user).createShort(encodedParams, {
        value: parseUnits("0.001", 18)
      });

      // Try to create second position
      await expect(
        createShort.connect(user).createShort(encodedParams, {
          value: parseUnits("0.001", 18)
        })
      ).to.be.revertedWith("Position already active");
    });

    it("should revert withdraw with zero execution fee", async function () {
      const withdrawParams = {
        user: user.address,
        exchangeRouter: mockExchangeRouter.target,
        reader: mockReader.target,
        USDC: usdc.target,
        orderVaultAddress: ZeroAddress,
        dataStoreAddress: ZeroAddress,
        routerAddress: mockExchangeRouter.target
      };

      const encodedWithdrawParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address,address,address,address,address,address,address)"],
        [[withdrawParams.user, withdrawParams.exchangeRouter, withdrawParams.reader, withdrawParams.USDC,
          withdrawParams.orderVaultAddress, withdrawParams.dataStoreAddress, withdrawParams.routerAddress]]
      );

      await expect(
        createShort.connect(user).withdrawShort(encodedWithdrawParams, {
          value: 0 // Zero execution fee
        })
      ).to.be.revertedWith("fee must be more than 0");
    });

    it("should revert when creating position with zero user address", async function () {
        const params = {
            user: ZeroAddress, // Zero address
            market: mockMarket.target,
            sizeDeltaUsd: parseUnits("1000", 30),
            wethAmount: parseUnits("1", 18),
            exchangeRouter: mockExchangeRouter.target,
            reader: mockReader.target,
            USDC: usdc.target,
            WETH: weth.target,
            uniswapSwap: uniswapSwap.target,
            orderVaultAddress: ZeroAddress,
            dataStoreAddress: ZeroAddress,
            routerAddress: mockExchangeRouter.target
        };

        const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
            ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
            [[params.user, params.market, params.sizeDeltaUsd, params.wethAmount, params.exchangeRouter, params.reader, 
              params.USDC, params.WETH, params.uniswapSwap, params.orderVaultAddress, params.dataStoreAddress, params.routerAddress]]
        );

        await expect(
            createShort.connect(user).createShort(encodedParams, {
                value: parseUnits("0.001", 18)
            })
        ).to.be.revertedWith("user must be not 0x0");
    });

    it("should revert when creating position with zero market address", async function () {
        const params = {
            user: user.address,
            market: ZeroAddress, // Zero address
            sizeDeltaUsd: parseUnits("1000", 30),
            wethAmount: parseUnits("1", 18),
            exchangeRouter: mockExchangeRouter.target,
            reader: mockReader.target,
            USDC: usdc.target,
            WETH: weth.target,
            uniswapSwap: uniswapSwap.target,
            orderVaultAddress: ZeroAddress,
            dataStoreAddress: ZeroAddress,
            routerAddress: mockExchangeRouter.target
        };

        const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
            ["tuple(address,address,uint256,uint256,address,address,address,address,address,address,address,address)"],
            [[params.user, params.market, params.sizeDeltaUsd, params.wethAmount, params.exchangeRouter, params.reader, 
              params.USDC, params.WETH, params.uniswapSwap, params.orderVaultAddress, params.dataStoreAddress, params.routerAddress]]
        );

        await expect(
            createShort.connect(user).createShort(encodedParams, {
                value: parseUnits("0.001", 18)
            })
        ).to.be.revertedWith("market must be not 0x0");
    });

    it("should revert withdraw with zero user address", async function () {
        const withdrawParams = {
            user: ZeroAddress, // Zero address
            exchangeRouter: mockExchangeRouter.target,
            reader: mockReader.target,
            USDC: usdc.target,
            orderVaultAddress: ZeroAddress,
            dataStoreAddress: ZeroAddress,
            routerAddress: mockExchangeRouter.target
        };

        const encodedWithdrawParams = ethers.AbiCoder.defaultAbiCoder().encode(
            ["tuple(address,address,address,address,address,address,address)"],
            [[withdrawParams.user, withdrawParams.exchangeRouter, withdrawParams.reader, withdrawParams.USDC,
              withdrawParams.orderVaultAddress, withdrawParams.dataStoreAddress, withdrawParams.routerAddress]]
        );

        await expect(
            createShort.connect(user).withdrawShort(encodedWithdrawParams, {
                value: parseUnits("0.001", 18)
            })
        ).to.be.revertedWith("user must be not 0x0");
    });
  });
});
