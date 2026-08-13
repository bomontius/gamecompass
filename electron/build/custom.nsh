; Game Compass intentionally allows a user-selected drive root such as D:\.
AllowRootDirInstall true

!ifndef BUILD_UNINSTALLER
  !include StrContains.nsh

  ; Keep the application inside its own folder when a drive root is supplied.
  !macro customInit
    ${StrContains} $0 "${APP_FILENAME}" $INSTDIR
    ${If} $0 == ""
      StrCpy $INSTDIR "$INSTDIR\${APP_FILENAME}"
    ${EndIf}
  !macroend
!endif
