class AudioJob < Struct.new(:audio)

  def perform
    asset = Gluttonberg::Asset.where(:id => audio).first
    if Gluttonberg::Setting.get_setting("audio_assets") == "Enable"
      if !Gluttonberg::Setting.get_setting("s3_key_id").blank? && !Gluttonberg::Setting.get_setting("s3_access_key").blank? && !Gluttonberg::Setting.get_setting("s3_server_url").blank? && !Gluttonberg::Setting.get_setting("s3_bucket").blank?
        asset.copy_audios_to_s3
      end

    end #setting enabled
  end

  def save_asset_to(asset)
    Rails.root.to_s + "/public" + asset.asset_folder_path
  end

end
