/******************************************************************************************************/
/* READ THE USER GROUPS IN A TEMPORARY FILE AND SEND EMAILS TO THE PROPER APPROVERS AND NOTIFIED PEOPLE 
/******************************************************************************************************/

var saptb_config = require('./TRUW001A_000_config.js');
var nodemailer = require('nodemailer');

saptb_config.inicioLibVar(__filename)


var userGroups = readUserGroups();
var tbJSONitems = readItensToSendEmail()
notifyUsers( tbJSONitems )

process.exitCode = 0


function readUserGroups() {

	var userGroupsTxt = fs.readFileSync(arqUsers, 'utf8');

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
	logger.debug(tbJSONitems);

    return tbJSONitems
}

function findEmailsInGroup(groupId) {


	function equalToGroupId (item) {
		return item.groupId==groupId;
	}
	var group = userGroups.filter(equalToGroupId)[0];
	if (!group) {
		var msg = "Could not find a user group: " + group
		saptb_config.logWithError (msg, null, true);
	}

	userEmails = JSON.stringify(group.users)
					 .replace ("[", "")
					 .replace ("]", "");

	return userEmails;
}

function notifyUsers() {

    var emailFrom      = "BNDES - TruBudget <trubudget@bndes.gov.br>"
    var emailTitle     = "[TruBudget] BNDES - Ateste de recebimento de desembolso"
    var mailTransporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false
    });

    for (var i = 0; i < tbJSONitems.length; i++) {
        var approversGroup = tbJSONitems[i].data["approvers-groupid"]
        
        var emailTo        = findEmailsInGroup(approversGroup)
        var emailCc        = config.emailCc 
        var projectNumber  = tbJSONitems[i].data["project-number"]
		var projectName    = tbNomeProjeto
		var subprojectName = tbJSONitems[i].data["subprojectName"]
		var paymentDate    = tbJSONitems[i].data["payment-date"]
        var currency       = tbJSONitems[i].data["currency-INFO"]
		var strAmount      = tbJSONitems[i].data["amount-INFO"]
		var displayNameItem= tbJSONitems[i].data["displayName"]

		logger.debug("approversGroup = " + approversGroup);		
		logger.debug("emailTo= " + emailTo);
		logger.debug("emailCc= " + emailCc);
		logger.debug("Amount = " + strAmount);
		logger.debug("displayNameItem = " + displayNameItem);

		var amount = parseFloat(strAmount);
		amount = amount.toFixed(2);
		let tbsite = urlbasetb.substring(0, urlbasetb.indexOf("br/")+2);

		var templateDoEMailTXT  = 
		"Prezado cliente,\n" +
		"\n" +
		"Esta é uma notificação automática do sistema TruBudget.\r\n" +
		"Um novo item de workflow foi gerado a partir de uma liberação de crédito realizada pelo BNDES.\n" +
		"\n" +
		"AÇÕES NECESSÁRIAS:\n" +
		"1. Utilizando o Google Chrome ou Firefox, acesse o site <trubudget-site>, escolha o ambiente 'Produção' e entre com as credenciais da sua organização.\n" +		
		"2. Clique no ícone 'Lupa - Visualizar' do '<project-name>' para visualizar seus detalhes.\n" +
		"3. Clique no ícone 'Lupa - Visualizar' associado ao '<subproject-name>' para visualizar seus detalhes.\n" +
		"4. Clique no ícone 'i - Informações' associado ao item de workflow em aberto '<display-name-item>' e confira as informações nele contidas. Se necessário, clique no ícone 'Lápis - Editar' associado a este item de workflow para corrigir as informações.\n" +
		"5. Clique no ícone 'Check - Aprovar' associado a este item de workflow para confirmar o recebimento deste desembolso na conta bancária do projeto e fechar o item de workflow.\n" +
		"\n" +
		"PRONTO! Muito obrigado! Sua ação é fundamental para aprimorar a transparência na utilização destes recursos.\n" +
		"\n" +
		"A liberação de crédito se refere aos dados abaixo:\n" +
		"Programa: <project-name>\n" +
		"Nome do Projeto: <subproject-name>\n" +
		"Valor: <currency> <amount>\n" +
		"Data do depósito: <payment-date>\n" +
		"\n" +
		"FIM DA MENSAGEM\n" ;

		templateDoEMailTXT = templateDoEMailTXT.replace(/<display-name-item>/g, displayNameItem);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<trubudget-site>/g, tbsite);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<approvers-groupid>/g, approversGroup);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<project-name>/g, projectName);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<subproject-name>/g, subprojectName);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<currency>/g, currency);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<amount>/g, amount);
		templateDoEMailTXT = templateDoEMailTXT.replace(/<payment-date>/g, paymentDate);

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
				var str = "Erro ao enviar emails";
				saptb_config.logWithError (msg, err, true);
            }
            else
            {
				logger.info("Sucesso ao enviar emails");
				logger.debug(info);
            }
        });
    }
}


