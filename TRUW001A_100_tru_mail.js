/******************************************************************************************************/
/* SCRIPT 08 - ENVIA NOTIFICACOES PARA AS PARTES INTERESSADAS                                         */
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');
var nodemailer = require('nodemailer');

saptb_config.inicioLibVar(__filename)


var userGroups = readUserGroups();
var tbJSONitems = readItensToSendEmail()
notifyUsers( tbJSONitems )

process.exitCode = 0


function readUserGroups() {

	var userGroupsTxt = fs.readFileSync(arqUsers, 'utf8'); //Leitura do Arquivo produzido em script anterior

	return JSON.parse(userGroupsTxt)

}

function readItensToSendEmail() {
    var tbJSONitems = []

    var linhas = fs.readFileSync(arqTBitem, 'utf8')
                    .split( CRLF )
                    .filter(Boolean)

    for (var i = 0; i < linhas.length; i++) {
        tbJSONitems[i] = JSON.parse(linhas[i])
		logger.debug(tbJSONitems[i])
		logger.debug(tbJSONitems[i].data.documents)        
    }

	//filter types to send email
	function equalToType2 (item) {
		return item.data["datatype-INFO"]==2;
	}
	tbJSONitems = tbJSONitems.filter(equalToType2);
	logger.info(tbJSONitems);

    return tbJSONitems
}

function findEmailsInGroup(groupId) {


	function equalToGroupId (item) {
		return item.groupId==groupId;
	}
	var group = userGroups.filter(equalToGroupId)[0];
	if (!group) {
        logger.error( "Could not find a this use group: " + group )
        process.exitCode = 1
		process.exit();
		//TODO FIXME: terminar a execucao - precisa rever todo o codigo para isso.
	}

	userEmails = JSON.stringify(group.users)
					 .replace ("[", "")
					 .replace ("]", "");

	//TODO FIXME: verificar se sao mesmo emails?

	return userEmails;
}

function notifyUsers() {

    var emailFrom      = "no-reply-trubudget@bndes.gov.br"
    var emailTitle     = "[Trubudget] BNDES - Ateste de recebimento de desembolso"
    var mailTransporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false
    });

    for (var i = 0; i < tbJSONitems.length; i++) {
        var approversGroup = tbJSONitems[i].data["approvers-groupid"]
        var notifiedGroup  = tbJSONitems[i].data["notified-groupid"]

        var emailTo        = findEmailsInGroup(approversGroup)
        var emailCc       = findEmailsInGroup(notifiedGroup)
        var projectNumber  = tbJSONitems[i].data["project-number"]
		var projectName    = tbNomeProjeto
		var subprojectName = tbJSONitems[i].data["subprojectName"]
		var paymentDate   = tbJSONitems[i].data["payment-date"]
        var currency       = tbJSONitems[i].data["currency-INFO"]
        var strAmount      = tbJSONitems[i].data["amount-INFO"]

		logger.debug("approversGroup = " + approversGroup);
		logger.debug("notifiedGroup = " + notifiedGroup);
		logger.debug("emailTo= " + emailTo);
		logger.debug("emailCc= " + emailCc);
		logger.debug("Amount = " + strAmount);

		var amount = parseFloat(strAmount);
		amount = amount.toFixed(2);

        var templateDoEMailTXT  = "Prezado cliente,\n\n" +
								"Esta é uma notificação automática do sistema TruBudget.\r\n" +
								"Um novo item de workflow foi gerado a partir de uma liberação de crédito realizada pelo BNDES.\n\n" +
								"AÇÃO NECESSÝRIA: Acesse o site https://trubudget.bndes.gov.br com suas credenciais e confirme o recebimento deste desembolso na conta bancária do projeto.\n"+
								"Sua ação é fundamental para aprimorar a transparência na utilização destes recursos.\n\n" +
								"A liberação de crédito se refere aos dados abaixo:\n" +
								"Programa: <project-name>\n" +
								"Nome do Projeto: <subproject-name>\n" +
								"Valor: <currency> <amount>\n" +
								"Data do depósito: <payment-date>\n" +
								"Fim da mensagem";

		templateDoEMailTXT = templateDoEMailTXT.replace(/<approvers-groupid>/g, approversGroup);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<project-name>/g, projectName);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<subproject-name>/g, subprojectName);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<currency>/g, currency);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<amount>/g, amount);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<payment-date>/g, paymentDate);


								/*
        var templateDoEMailHTML = '<p>Foi incluído novo comentário na ideia <strong>' + ideia.title + '</strong>.</p><p>Quem comentou: ' + nomeQuemComentou + '</p><p>Comentário: ' + textoComentario + "</p><p>Acesse a ideia através do link: " + config.negocio.url_compartilhamento_ideia + ideia._id + "</p>" // html body
*/
//TODO: setar o HTML
        var mailOptions = {
            from   : emailFrom,
            to     : emailTo,
            cc     : emailCc,
            subject: emailTitle,
            text   : templateDoEMailTXT
		};

        mailTransporter.sendMail(mailOptions, (err, info) =>
        {
            if (err)
            {
				logger.error("Erro ao enviar emails");
				logger.error(err);
            }
            else
            {
				logger.info("Sucesso ao enviar emails");
				logger.debug(info);
            }
        });
    }
}


