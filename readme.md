## How to build the project

```bash
  eas build -p android --profile preview
```
   // const sendNfe = async (scannerNotaFiscal: string) => {
  //   try {
  //     const status = await validateStatus(scannerNotaFiscal)
  //     console.log(status)
  //     if (status.length == 0) {
  //       const res = await axios.get(URL_VALIDATE_DATA_SCANNER + `chaveAcesso=${scannerNotaFiscal}&unidadeIE=${storeCode}`)
  //       if (res.status == 200 && res.data.length > 0) {
  //         setNfe(res.data[0]);
  //         setLoading(false);
  //         setCameraStats(true);
  //         Toast.show({
  //           type: 'success',
  //           text1: 'NFE pronta para cadastro',
  //           text1Style: {
  //             alignContent: "center"
  //           },
  //           visibilityTime: 5000
  //         });
  //         navigation.navigate("Dash")
  //       } else {
  //         setCameraStats(false)
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error na leitura!',
  //           visibilityTime: 5000
  //         });

  //         navigation.navigate("ScannerNFe")
  //       }
  //     } else {
  //       setCameraStats(false)
  //       Toast.show({
  //         type: 'error',
  //         text1: 'NFE já cadastrada no sistema.',
  //         visibilityTime: 5000
  //       });

  //       navigation.navigate("ScannerNFe")
  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
 const openGallery = async () => {
    let formData = new FormData();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets[0].uri) {
        result.assets.forEach((asset, index) => {
          const imageName = `photo_${index}.png`;

          formData.append("images", {
            uri: asset.uri,
            name: imageName,
            type: "image/jpg"
          })

        })

        const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(data => {
          console.log(data.data)
          setImageUris([]);
        })
      }

    } catch (error) {
      console.error('Erro ao abrir a galeria:', error);
    }
  };


&&
                (res.data.data.permissions.admin === 1 ||
                    res.data.data.permissions.exp === 1 ||
                    res.data.data.permissions.expl === 1)


                    vault_authentication=TOKEN;vault_configimport=vault://;vault_enabled=true;vault_host=staging-potiguar-vault.portela-professional.com.br;vault_kv_backend=staging;vault_kv_default_context=mcs-eportal-retirada-cliente-api;vault_port=8200;vault_token=8cdac604-c40c-4126-816a-e958749faed6
            

  // const sendNfe = async (scannerNotaFiscal: string) => {
  //   try {
  //     const status = await validateStatus(scannerNotaFiscal)
  //     console.log(status)
  //     if (status.length == 0) {
  //       const res = await axios.get(URL_VALIDATE_DATA_SCANNER + `chaveAcesso=${scannerNotaFiscal}&unidadeIE=${storeCode}`)
  //       if (res.status == 200 && res.data.length > 0) {
  //         setNfe(res.data[0]);
  //         setLoading(false);
  //         setCameraStats(true);
  //         Toast.show({
  //           type: 'success',
  //           text1: 'NFE pronta para cadastro',
  //           text1Style: {
  //             alignContent: "center"
  //           },
  //           visibilityTime: 5000
  //         });
  //         navigation.navigate("Dash")
  //       } else {
  //         setCameraStats(false)
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error na leitura!',
  //           visibilityTime: 5000
  //         });

  //         navigation.navigate("ScannerNFe")
  //       }
  //     } else {
  //       setCameraStats(false)
  //       Toast.show({
  //         type: 'error',
  //         text1: 'NFE já cadastrada no sistema.',
  //         visibilityTime: 5000
  //       });

  //       navigation.navigate("ScannerNFe")
  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }