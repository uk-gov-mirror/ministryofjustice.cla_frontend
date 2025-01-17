{{/*
Expand the name of the chart.
*/}}
{{- define "cla-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "cla-frontend.whitelist" -}}
{{ join "," .Values.ingress.whitelist }}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "cla-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cla-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cla-frontend.labels" -}}
helm.sh/chart: {{ include "cla-frontend.chart" . }}
{{ include "cla-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "cla-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cla-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "cla-frontend.app.vars" -}}
{{- $environment := .Values.environment -}}
- name: ALLOWED_HOSTS
  value: "{{ .Values.host }}"
- name: CLA_ENV
  value: "{{ $environment }}"
- name: SITE_HOSTNAME
  value: "{{ .Values.host }}"
{{/* TODO Might be removable */}}
- name: HOST_NAME
  value: "{{ .Values.host }}"
{{ range $name, $data := .Values.envVars }}
- name: {{ $name }}
{{- if $data.value }}
  value: "{{ $data.value }}"
{{- else if $data.secret }}
  valueFrom:
    secretKeyRef:
      name: {{ $data.secret.name }}
      key: {{ $data.secret.key }}
      {{- if eq $environment "development" }}
      optional: true
      {{- else }}
      optional: {{ $data.secret.optional | default false }}
      {{- end }}
{{- end -}}
{{- end -}}
{{- end -}}