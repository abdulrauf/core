# encoding: utf-8

module Gluttonberg
  module Public
    module PageInfo

      def page_title
        title_setting = Gluttonberg::Setting.get_setting("title", current_site_config_name)
        page_title = _prepare_page_title

        if page_title.blank?
          title_setting
        elsif title_setting.blank?
          page_title
        else
          "#{page_title} | #{title_setting}"
        end
      end

      def og_title
        og_title = _prepare_page_title
        return og_title if !og_title.blank?
        return nil
      end

      def og_site_name
        og_site_name = Gluttonberg::Setting.get_setting("title", current_site_config_name)
        return og_site_name if !og_site_name.blank?
        return nil
      end

      def og_image
        path = nil
        object = find_current_object_for_meta_tags
        fb_icon_id = Gluttonberg::Setting.get_setting("fb_icon", current_site_config_name)

        if !object.blank? && object.respond_to?(:fb_icon_id) && !object.fb_icon_id.blank?
          fb_icon_id = object.fb_icon_id
        end

        asset = unless fb_icon_id.blank?
          Asset.where(:id => fb_icon_id).first
        end

        path = asset.url unless asset.blank?
        "http://#{request.host_with_port}#{path}" if path
      end

      alias_method :page_fb_icon_path, :og_image

      def page_description
        object = find_current_object_for_meta_tags
        description_settings = Gluttonberg::Setting.get_setting("description", current_site_config_name)
        page_description = if !object.blank? && object.respond_to?(:seo_description)
          object.seo_description
        end

        if !page_description.blank?
          page_description
        else !description_settings.blank?
          description_settings
        end
      end

      def page_keywords
        object = find_current_object_for_meta_tags
        keywords_settings = Gluttonberg::Setting.get_setting("keywords", current_site_config_name)
        page_keywords = if !object.blank? && object.respond_to?(:seo_keywords)
          object.seo_keywords
        end

        if !page_keywords.blank?
          page_keywords
        elsif !keywords_settings.blank?
          keywords_settings
        end
      end

      def body_class(page=nil)
        page = @page if page.blank?
        if !page.blank?
         "page #{page.current_localization.slug.blank? ? page.slug : page.current_localization.slug} #{page.home? ? 'home' : ''}"
        else
          object = find_current_object_for_meta_tags
          unless object.blank?
            class_name = (Gluttonberg.constants.include?(:Blog) && object.kind_of?(Gluttonberg::Blog::ArticleLocalization) ? 'post' : object.class.name.demodulize.downcase)
            "#{class_name} #{object.slug}"
          end
        end
      end

      private

        def find_current_object_for_meta_tags
          if !@page.blank?
            @page.current_localization
          elsif !@article.blank?
            @article.current_localization
          elsif !@blog.blank?
            @blog
          elsif !@custom_model_object.blank?
            @custom_model_object
          end
        end

        def _prepare_page_title
          object = find_current_object_for_meta_tags
          page_title = nil
          page_title = unless object.blank?
            [:seo_title, :title, :name, :title_or_name?].each do |method|
              if object.respond_to?(method) && !object.send(method).blank?
                return object.send(method)
              end
            end
          end
        end


    end
  end
end
