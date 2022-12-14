const {
    createDB,
    clearDB,
    closeDB
} = require('../db');
const {
    regester,
    strongLogin,
    searchUser
} = require('../../controller/usercontroller');
const {
    mockRequest,
    mockResponse
} = require('../interceptor')
const convert = require('../../converter/multiObjconverter')
const userModel = require('../../model/user.model')
const bcrypt = require('bcrypt')
const userPayload = {
    name: "test",
    userType: "student",
    userId: "1",
    email: "test@gmail.com",
    password: "test"
}
beforeAll(async () => await createDB());
beforeEach(async () => await clearDB());
afterAll(async () => await closeDB());
describe("Auth testing !", () => {
    it("register should pass!", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = userPayload;
        //action
        await regester(req, res);
        //asserts
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Register Successfully",
                success: true
            })
        )
    })
    it("register should fail due to not provide proper data", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            name: "test",
            userType: "student",
            email: "test@gmail.com"
        }
        //action
        await regester(req, res);
        //asserts
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "some information needed please fill it!",
                success: false
            })
        )
    })
    it("register should fail due to database internal error", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = userPayload;
        const userSPy = jest.spyOn(userModel, 'create').mockReturnValue(Promise.reject("Internal error occuring"));
        //action
        await regester(req, res);
        //asserts
        expect(userSPy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error!",
                success: false
            })
        )
    })
})

describe("Login testing!", () => {
    it("login should pass", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(userPayload));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        await strongLogin(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "you are login successfully!",
                success: true,
                userDetails: expect.objectContaining({
                    email: userPayload.email,
                })
            })
        )
    })
    it("login should fail due to wrong email", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test1@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(null));
        await strongLogin(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Invalied Email ID!",
                success: false
            })
        )
    })
    it("login should fail due to wrong password", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test454"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(userPayload));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
        await strongLogin(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalied Password!',
                success: false
            })
        )
    })
    it("login should fail due to database error", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.reject("error occuring"));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        await strongLogin(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error!"
            })
        )
    })
})

describe("search user testing!", () => {
    it("search by id should pass ", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            userId: 1
        }
        const userSpy = jest.spyOn(userModel, 'find').mockReturnValue(Promise.resolve([userPayload]));
        const converts = jest.spyOn(convert, 'userConverter').mockReturnValue([userPayload])
        await searchUser(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(converts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "user find successfully!",
                success: true,
                userSummary: expect.arrayContaining([
                    expect.objectContaining({
                        "email": "test@gmail.com",
                        "name": "test",
                        "password": "test",
                        "userId": "1",
                        "userType": "student"
                    })
                ])
            })
        )
    })
    it("search by name should pass ", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            name: "test"
        }
        const userSpy = jest.spyOn(userModel, 'find').mockReturnValue(Promise.resolve([userPayload]));
        const converts = jest.spyOn(convert, 'userConverter').mockReturnValue([userPayload])
        await searchUser(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(converts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "user find successfully!",
                success: true,
                userSummary: expect.arrayContaining([
                    expect.objectContaining({
                        "email": "test@gmail.com",
                        "name": "test",
                        "password": "test",
                        "userId": "1",
                        "userType": "student"
                    })
                ])
            })
        )
    })
    it("search by email should pass ", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            email: "test@gmail.com"
        }
        const userSpy = jest.spyOn(userModel, 'find').mockReturnValue(Promise.resolve([userPayload]));
        const converts = jest.spyOn(convert, 'userConverter').mockReturnValue([userPayload])
        await searchUser(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(converts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "user find successfully!",
                success: true,
                userSummary: expect.arrayContaining([
                    expect.objectContaining({
                        "email": "test@gmail.com",
                        "name": "test",
                        "password": "test",
                        "userId": "1",
                        "userType": "student"
                    })
                ])
            })
        )
    })
    it("search by user type should pass ", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            type: "student"
        }
        const userSpy = jest.spyOn(userModel, 'find').mockReturnValue(Promise.resolve([userPayload]));
        const converts = jest.spyOn(convert, 'userConverter').mockReturnValue([userPayload])
        await searchUser(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(converts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "user find successfully!",
                success: true,
                userSummary: expect.arrayContaining([
                    expect.objectContaining({
                        "email": "test@gmail.com",
                        "name": "test",
                        "password": "test",
                        "userId": "1",
                        "userType": "student"
                    })
                ])
            })
        )
    })
    it("search should fail due to any errors ", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            name: "test"
        }
        const userSpy = jest.spyOn(userModel, 'find').mockReturnValue(Promise.reject("error occuring"));
        const converts = jest.spyOn(convert, 'userConverter').mockReturnValue([userPayload])
        await searchUser(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(converts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error!",
                success: false
            })
        )
    })
})