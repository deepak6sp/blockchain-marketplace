const Marketplace = artifacts.require("Marketplace");

contract('MarketPlace', ([deployer, seller, buyer]) => {
    let marketplace;
    before(async () => {
        marketplace = await Marketplace.deployed()
    });

    describe("Test", () => {
        it("receives address", async () => {
            assert.notEqual(await marketplace.address, '0x0')
        })

        it("has a name", async () => {
            assert.equal(await marketplace.name(), 'My Marketplace')
        })

    })

    describe("Products", () => {
        let result, productCount;

        before(async () => {
            result = await marketplace.createProduct('Iphone', web3.utils.toWei('1', 'Ether'), { from: seller})
            productCount = await marketplace.productCount()
        });

        it("create products", async () => {
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.owner, seller, 'seller is correct')
        })

        it("lists products", async () => {
            const product = await marketplace.products(productCount)
            assert.equal(product.name, 'Iphone', 'product name is correct')
        })

    })
})