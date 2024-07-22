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
            assert.equal(await marketplace.name(), 'Marketplace')
        })

    })

    describe("Products", () => {
        let result, productCount;

        before(async () => {
            console.log("seller>>>", seller)
            result = await marketplace.createProduct('Iphone', web3.utils.toWei('1', 'Ether'), { from: seller})
            productCount = await marketplace.productCount()
        });

        it("create products", async () => {
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            console.log("create event>>", event)
            assert.equal(event.owner, seller, 'seller is correct')
        })

        it("lists products", async () => {
            const product = await marketplace.products(productCount)
            assert.equal(product.name, 'Iphone', 'product name is correct')
        })

        it("buy products", async () => {
            result = await marketplace.buyProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})
            // assert.equal(buyProduct.name, 'Iphone', 'product name is correct')
            const event = result.logs[0].args
            console.log("purchase event>>", event)
            assert.equal(event.owner, buyer, 'buyer is correct')

        })

    })
})