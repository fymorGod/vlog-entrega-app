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
