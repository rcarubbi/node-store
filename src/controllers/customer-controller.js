'use strict';


const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e
        });
    }
};


exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(401).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }
        const token = await authService.generateToken({
            email: customer.email,
            name: customer.name,
            id: customer._id
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                id: customer._id
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e
        });
    }
};


exports.refreshToken = async (req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);


        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }
        const newToken = await authService.generateToken({
            email: customer.email,
            name: customer.name,
            id: customer._id
        });

        res.status(201).send({
            token: newToken,
            data: {
                email: customer.email,
                name: customer.name,
                id: customer._id
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e
        });
    }
};

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O Nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send(
            req.body.email,
            "Bem vindo ao node store!",
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({
            message: "Cliente cadastrado com sucesso!"
        });
    } catch (err) {

        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: err
        });
    }
};

