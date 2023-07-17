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
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

/**
 * @author Nilton Vieira
 */
public class UpdateExamResult {

    public void updateObjectEntry(Document document, JSONObject jsonObject, String jwtToken) {
        System.out.println(jwtToken);
        JSONObject objectEntryRayHealthJsonObject = jsonObject.getJSONObject(
                "objectEntryDTORayHealth");

        JSONObject jsonProperties =
                objectEntryRayHealthJsonObject.getJSONObject("properties");

        jsonProperties.put("result", document.getId());
        jsonProperties.remove("examDate"); //prevent parse errors

        WebClient.Builder builder = WebClient.builder();

        WebClient webClient = builder.baseUrl(
                _lxcDXPServerProtocol + "://" + _lxcDXPMainDomain
        ).defaultHeader(
                HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE
        ).defaultHeader(
                HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE
        ).build();

        webClient.patch(
        ).uri(
                "/o/c/rayhealths/{examId}",
                objectEntryRayHealthJsonObject.getLong("id")
        ).bodyValue(
                jsonProperties.toString()
        ).header(
                HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken
        ).exchangeToMono(
                clientResponse -> {
                    HttpStatus httpStatus = clientResponse.statusCode();

                    if (httpStatus.is2xxSuccessful()) {
                        return clientResponse.bodyToMono(String.class);
                    }
                    else if (httpStatus.is4xxClientError()) {
                        if (_log.isInfoEnabled()) {
                            _log.info("Output: " + httpStatus.getReasonPhrase());
                        }
                    }

                    Mono<WebClientResponseException> mono =
                            clientResponse.createException();

                    return mono.flatMap(Mono::error);
                }
        ).retryWhen(
                Retry.backoff(
                        3, Duration.ofSeconds(1)
                ).doAfterRetry(
                        retrySignal -> _log.info("Retrying request")
                )
        ).subscribe();
    }

    private static final Log _log = LogFactory.getLog(
            UpdateExamResult.class);

    private String _lxcDXPMainDomain = "localhost:8080";

    private String _lxcDXPServerProtocol = "http";

}
