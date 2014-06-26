angular.module("cla.config", [])

.constant("CASE_STATES", [
	{
		"text": "Open",
		"value": "open"
	},
	{
		"text": "Closed",
		"value": "closed"
	},
	{
		"text": "Rejected",
		"value": "rejected"
	},
	{
		"text": "Accepted",
		"value": "accepted"
	}
])

.constant("ADAPTATION_LANGUAGES", [
	{
		"text": "Assamese",
		"value": "ASSAMESE"
	},
	{
		"text": "Azeri",
		"value": "AZERI"
	},
	{
		"text": "Afrikaans",
		"value": "AFRIKAANS"
	},
	{
		"text": "Algerian",
		"value": "ALGERIAN"
	},
	{
		"text": "Ashanti",
		"value": "ASHANTI"
	},
	{
		"text": "Akan",
		"value": "AKAN"
	},
	{
		"text": "Albanian",
		"value": "ALBANIAN"
	},
	{
		"text": "Amharic",
		"value": "AMHARIC"
	},
	{
		"text": "Armenian",
		"value": "ARMENIAN"
	},
	{
		"text": "Arabic",
		"value": "ARABIC"
	},
	{
		"text": "Assyrian",
		"value": "ASSYRIAN"
	},
	{
		"text": "Azerbaijani",
		"value": "AZERBAIJANI"
	},
	{
		"text": "Badini",
		"value": "BADINI"
	},
	{
		"text": "Bengali",
		"value": "BENGALI"
	},
	{
		"text": "Burmese",
		"value": "BURMESE"
	},
	{
		"text": "Bajuni",
		"value": "BAJUNI"
	},
	{
		"text": "Belorussian",
		"value": "BELORUSSIAN"
	},
	{
		"text": "Bosnian",
		"value": "BOSNIAN"
	},
	{
		"text": "Berber",
		"value": "BERBER"
	},
	{
		"text": "Basque",
		"value": "BASQUE"
	},
	{
		"text": "Bulgarian",
		"value": "BULGARIAN"
	},
	{
		"text": "Brava",
		"value": "BRAVA"
	},
	{
		"text": "Brazilian",
		"value": "BRAZILIAN"
	},
	{
		"text": "Cantonese",
		"value": "CANTONESE"
	},
	{
		"text": "Cebuano",
		"value": "CEBUANO"
	},
	{
		"text": "Creole",
		"value": "CREOLE"
	},
	{
		"text": "Chinese",
		"value": "CHINESE"
	},
	{
		"text": "Cherokee",
		"value": "CHEROKEE"
	},
	{
		"text": "Columbian",
		"value": "COLUMBIAN"
	},
	{
		"text": "Cambodian",
		"value": "CAMBODIAN"
	},
	{
		"text": "Chaochow",
		"value": "CHAOCHOW"
	},
	{
		"text": "Croatian",
		"value": "CROATIAN"
	},
	{
		"text": "Catalan",
		"value": "CATALAN"
	},
	{
		"text": "Czech",
		"value": "CZECH"
	},
	{
		"text": "Danish",
		"value": "DANISH"
	},
	{
		"text": "Dari",
		"value": "DARI"
	},
	{
		"text": "Dutch",
		"value": "DUTCH"
	},
	{
		"text": "Egyptian",
		"value": "EGYPTIAN"
	},
	{
		"text": "English",
		"value": "ENGLISH"
	},
	{
		"text": "Estonian",
		"value": "ESTONIAN"
	},
	{
		"text": "Eritrean",
		"value": "ERITREAN"
	},
	{
		"text": "Esperanto",
		"value": "ESPERANTO"
	},
	{
		"text": "Ethiopian",
		"value": "ETHIOPIAN"
	},
	{
		"text": "Farsi",
		"value": "FARSI"
	},
	{
		"text": "Fijian",
		"value": "FIJIAN"
	},
	{
		"text": "Flemish",
		"value": "FLEMISH"
	},
	{
		"text": "Fanti",
		"value": "FANTI"
	},
	{
		"text": "French",
		"value": "FRENCH"
	},
	{
		"text": "Finnish",
		"value": "FINNISH"
	},
	{
		"text": "Fulla",
		"value": "FULLA"
	},
	{
		"text": "Ga",
		"value": "GA"
	},
	{
		"text": "German",
		"value": "GERMAN"
	},
	{
		"text": "Gurmukhi",
		"value": "GURMUKHI"
	},
	{
		"text": "Gaelic",
		"value": "GAELIC"
	},
	{
		"text": "Gorani",
		"value": "GORANI"
	},
	{
		"text": "Georgian",
		"value": "GEORGIAN"
	},
	{
		"text": "Greek",
		"value": "GREEK"
	},
	{
		"text": "Gujarati",
		"value": "GUJARATI"
	},
	{
		"text": "Hakka",
		"value": "HAKKA"
	},
	{
		"text": "Hebrew",
		"value": "HEBREW"
	},
	{
		"text": "Hindi",
		"value": "HINDI"
	},
	{
		"text": "Homa",
		"value": "HOMA"
	},
	{
		"text": "Hausa",
		"value": "HAUSA"
	},
	{
		"text": "Hungarian",
		"value": "HUNGARIAN"
	},
	{
		"text": "Hui",
		"value": "HUI"
	},
	{
		"text": "Icelandic",
		"value": "ICELANDIC"
	},
	{
		"text": "Igbo",
		"value": "IGBO"
	},
	{
		"text": "Ilocano",
		"value": "ILOCANO"
	},
	{
		"text": "Indonesian",
		"value": "INDONESIAN"
	},
	{
		"text": "Iraqi",
		"value": "IRAQI"
	},
	{
		"text": "Iranian",
		"value": "IRANIAN"
	},
	{
		"text": "Italian",
		"value": "ITALIAN"
	},
	{
		"text": "Japanese",
		"value": "JAPANESE"
	},
	{
		"text": "Kashmiri",
		"value": "KASHMIRI"
	},
	{
		"text": "Kreo",
		"value": "KREO"
	},
	{
		"text": "Kirundi",
		"value": "KIRUNDI"
	},
	{
		"text": "Kurmanji",
		"value": "KURMANJI"
	},
	{
		"text": "Kannada",
		"value": "KANNADA"
	},
	{
		"text": "Korean",
		"value": "KOREAN"
	},
	{
		"text": "Krio",
		"value": "KRIO"
	},
	{
		"text": "Kosovan",
		"value": "KOSOVAN"
	},
	{
		"text": "Kurdish",
		"value": "KURDISH"
	},
	{
		"text": "Kinyarwanda",
		"value": "KINYARWANDA"
	},
	{
		"text": "Kinyamirenge",
		"value": "KINYAMIRENGE"
	},
	{
		"text": "Kazakh",
		"value": "KAZAKH"
	},
	{
		"text": "Latvian",
		"value": "LATVIAN"
	},
	{
		"text": "Laotian",
		"value": "LAOTIAN"
	},
	{
		"text": "Lao",
		"value": "LAO"
	},
	{
		"text": "Lubwisi",
		"value": "LUBWISI"
	},
	{
		"text": "Lebanese",
		"value": "LEBANESE"
	},
	{
		"text": "Lingala",
		"value": "LINGALA"
	},
	{
		"text": "Luo",
		"value": "LUO"
	},
	{
		"text": "Lusoga",
		"value": "LUSOGA"
	},
	{
		"text": "Lithuanian",
		"value": "LITHUANIAN"
	},
	{
		"text": "Luganda",
		"value": "LUGANDA"
	},
	{
		"text": "Mandarin",
		"value": "MANDARIN"
	},
	{
		"text": "Macedonian",
		"value": "MACEDONIAN"
	},
	{
		"text": "Moldovan",
		"value": "MOLDOVAN"
	},
	{
		"text": "Mirpuri",
		"value": "MIRPURI"
	},
	{
		"text": "Mandinka",
		"value": "MANDINKA"
	},
	{
		"text": "Malay",
		"value": "MALAY"
	},
	{
		"text": "Mongolian",
		"value": "MONGOLIAN"
	},
	{
		"text": "Moroccan",
		"value": "MOROCCAN"
	},
	{
		"text": "Marathi",
		"value": "MARATHI"
	},
	{
		"text": "Maltese",
		"value": "MALTESE"
	},
	{
		"text": "Malayalam",
		"value": "MALAYALAM"
	},
	{
		"text": "Ndebele",
		"value": "NDEBELE"
	},
	{
		"text": "Nepalese",
		"value": "NEPALESE"
	},
	{
		"text": "Nigerian",
		"value": "NIGERIAN"
	},
	{
		"text": "Norwegian",
		"value": "NORWEGIAN"
	},
	{
		"text": "Nyakuse",
		"value": "NYAKUSE"
	},
	{
		"text": "Oromo",
		"value": "OROMO"
	},
	{
		"text": "Other",
		"value": "OTHER"
	},
	{
		"text": "Pahari",
		"value": "PAHARI"
	},
	{
		"text": "Persian",
		"value": "PERSIAN"
	},
	{
		"text": "Portuguese",
		"value": "PORTUGUESE"
	},
	{
		"text": "Philipino",
		"value": "PHILIPINO"
	},
	{
		"text": "Polish",
		"value": "POLISH"
	},
	{
		"text": "Pothwari",
		"value": "POTHWARI"
	},
	{
		"text": "Pusthu",
		"value": "PUSTHU"
	},
	{
		"text": "Punjabi",
		"value": "PUNJABI"
	},
	{
		"text": "Romanian",
		"value": "ROMANIAN"
	},
	{
		"text": "Russian",
		"value": "RUSSIAN"
	},
	{
		"text": "Sotho",
		"value": "SOTHO"
	},
	{
		"text": "Serbo-Croat",
		"value": "SERBO-CROAT"
	},
	{
		"text": "Swedish",
		"value": "SWEDISH"
	},
	{
		"text": "Serbian",
		"value": "SERBIAN"
	},
	{
		"text": "Shona",
		"value": "SHONA"
	},
	{
		"text": "Sinhalese",
		"value": "SINHALESE"
	},
	{
		"text": "Siraiki",
		"value": "SIRAIKI"
	},
	{
		"text": "Slovak",
		"value": "SLOVAK"
	},
	{
		"text": "Samoan",
		"value": "SAMOAN"
	},
	{
		"text": "Slovenian",
		"value": "SLOVENIAN"
	},
	{
		"text": "Somali",
		"value": "SOMALI"
	},
	{
		"text": "Sorani",
		"value": "SORANI"
	},
	{
		"text": "Spanish",
		"value": "SPANISH"
	},
	{
		"text": "Sri Lankan",
		"value": "SRI LANKAN"
	},
	{
		"text": "Scottish Gaelic",
		"value": "SCOTTISH GAELIC"
	},
	{
		"text": "Sudanese",
		"value": "SUDANESE"
	},
	{
		"text": "Swahili",
		"value": "SWAHILI"
	},
	{
		"text": "Swahilli",
		"value": "SWAHILLI"
	},
	{
		"text": "Sylheti",
		"value": "SYLHETI"
	},
	{
		"text": "Tamil",
		"value": "TAMIL"
	},
	{
		"text": "Tibetan",
		"value": "TIBETAN"
	},
	{
		"text": "Telegu",
		"value": "TELEGU"
	},
	{
		"text": "Elakil",
		"value": "ELAKIL"
	},
	{
		"text": "Tagalog",
		"value": "TAGALOG"
	},
	{
		"text": "Thai",
		"value": "THAI"
	},
	{
		"text": "Tigrinian",
		"value": "TIGRINIAN"
	},
	{
		"text": "Tigre",
		"value": "TIGRE"
	},
	{
		"text": "Tajik",
		"value": "TAJIK"
	},
	{
		"text": "Taiwanese",
		"value": "TAIWANESE"
	},
	{
		"text": "Turkmanish",
		"value": "TURKMANISH"
	},
	{
		"text": "Tswana",
		"value": "TSWANA"
	},
	{
		"text": "Turkish",
		"value": "TURKISH"
	},
	{
		"text": "Twi",
		"value": "TWI"
	},
	{
		"text": "Ugandan",
		"value": "UGANDAN"
	},
	{
		"text": "Ukranian",
		"value": "UKRANIAN"
	},
	{
		"text": "Urdu",
		"value": "URDU"
	},
	{
		"text": "Ussian",
		"value": "USSIAN"
	},
	{
		"text": "Uzbek",
		"value": "UZBEK"
	},
	{
		"text": "Vietnamese",
		"value": "VIETNAMESE"
	},
	{
		"text": "Welsh",
		"value": "WELSH"
	},
	{
		"text": "Wolof",
		"value": "WOLOF"
	},
	{
		"text": "Xhosa",
		"value": "XHOSA"
	},
	{
		"text": "Yugoslavian",
		"value": "YUGOSLAVIAN"
	},
	{
		"text": "Yiddish",
		"value": "YIDDISH"
	},
	{
		"text": "Yoruba",
		"value": "YORUBA"
	},
	{
		"text": "Zulu",
		"value": "ZULU"
	}
])

.constant("THIRDPARTY_RELATIONSHIP", [
	{
		"text": "Parent or guardian",
		"value": "PARENT_GUARDIAN"
	},
	{
		"text": "Family member or friend",
		"value": "FAMILY_FRIEND"
	},
	{
		"text": "Professional",
		"value": "PROFESSIONAL"
	},
	{
		"text": "Legal adviser",
		"value": "LEGAL_ADVISOR"
	},
	{
		"text": "Other",
		"value": "OTHER"
	}
])

.constant("THIRDPARTY_REASON", [
	{
		"text": "Child or patient",
		"value": "CHILD_PATIENT"
	},
	{
		"text": "Subject to power of attorney",
		"value": "POWER_ATTORNEY"
	},
	{
		"text": "Cannot communicate via the telephone, due to disability",
		"value": "NO_TELEPHONE_DISABILITY"
	},
	{
		"text": "Cannot communicate via the telephone, due to a language requirement",
		"value": "NO_TELEPHONE_LANGUAGE"
	},
	{
		"text": "Other",
		"value": "OTHER"
	}
])

.constant("TITLES", [
	{
		"text": "Mr",
		"value": "mr"
	},
	{
		"text": "Mrs",
		"value": "mrs"
	},
	{
		"text": "Miss",
		"value": "miss"
	},
	{
		"text": "Ms",
		"value": "ms"
	},
	{
		"text": "Dr",
		"value": "dr"
	}
])

.constant("ELIGIBILITY_STATES", [
	{
		"text": "Unknown",
		"value": "unknown"
	},
	{
		"text": "Yes",
		"value": "yes"
	},
	{
		"text": "No",
		"value": "no"
	}
])

;