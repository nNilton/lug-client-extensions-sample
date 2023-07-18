/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.rayhealth;

import com.liferay.headless.delivery.client.dto.v1_0.Document;
import com.liferay.headless.delivery.client.resource.v1_0.DocumentResource;

import fr.opensagres.xdocreport.document.IXDocReport;
import fr.opensagres.xdocreport.document.registry.XDocReportRegistry;
import fr.opensagres.xdocreport.template.IContext;
import fr.opensagres.xdocreport.template.TemplateEngineKind;

import java.io.*;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Nilton Vieira
 */
@RequestMapping("/object/action/exam/result")
@RestController
public class ExamResultRestController {

	public void generateReport(JSONObject template, File file)
		throws Exception {

		InputStream inputStream =
			ExamResultRestController.class.getResourceAsStream(
				"/template-report1.odt");

		XDocReportRegistry xDocReportRegistry =
			XDocReportRegistry.getRegistry();

		IXDocReport report = xDocReportRegistry.loadReport(
			inputStream, TemplateEngineKind.Freemarker);

		IContext context = report.createContext();

		context.put("template", template);

		OutputStream outputStream = new FileOutputStream(file);

		report.process(context, outputStream);

		outputStream.close();
	}

	@PostMapping
	public ResponseEntity<String> post(
			@AuthenticationPrincipal Jwt jwt, @RequestBody String json)
		throws Exception {

		String jwtToken = jwt.getTokenValue();
		JSONObject jsonObject = new JSONObject(json);

		File tempOdtFinal = File.createTempFile("reportODTFinal", ".odt");

		generateReport(getReplaceTemplate(jsonObject), tempOdtFinal);

		String tmpdir = System.getProperty("java.io.tmpdir");

		ProcessBuilder processBuilder = new ProcessBuilder(
			_libreOfficePath, "--headless", "--convert-to",
			"pdf:writer_pdf_Export", "--outdir", tmpdir,
			tempOdtFinal.getAbsolutePath());

		Process process = processBuilder.start();

		process.waitFor();

		String fileName = tempOdtFinal.getName();

		File pdfFile = new File(tmpdir, fileName.split(".odt")[0] + ".pdf");

		Document document = uploadToDocumentLibery(pdfFile);

		try {
			_updateExamResult.updateObjectEntry(document, jsonObject, jwtToken);
		}
		catch (Exception exception) {
			_log.debug(exception);
		}

		tempOdtFinal.delete();
		pdfFile.delete();
		System.out.println("End :: [generatePDF]");

		return new ResponseEntity<>(json, HttpStatus.OK);
	}

	public Document uploadToDocumentLibery(File file) throws Exception {
		Map<String, File> map = new HashMap<>();

		map.put("file", file);

		DocumentResource.Builder documentResourceBuilder =
			DocumentResource.builder();

		DocumentResource documentResource =
			documentResourceBuilder.authentication(
				"test@liferay.com", "test"
			).build();

		return documentResource.postSiteDocument(20119L, null, map);
	}

	private JSONObject getReplaceTemplate(JSONObject jsonObject) {
		JSONObject template = new JSONObject();

		template.put(
			"date",
			jsonObject.getJSONObject(
				"originalObjectEntry"
			).getString(
				"statusDate"
			));
		template.put(
			"exam",
			jsonObject.getJSONObject(
				"objectEntryDTORayHealth"
			).getJSONObject(
				"properties"
			).getJSONObject(
				"examName"
			).getString(
				"name"
			));
		template.put("id", String.valueOf(jsonObject.getLong("classPK")));
		template.put("name", jsonObject.getString("userName"));

		return template;
	}

	private static final Log _log = LogFactory.getLog(
		ExamResultRestController.class);

	@Value("${libreoffice.path}")
	private String _libreOfficePath;

	private final UpdateExamResult _updateExamResult = new UpdateExamResult();

}