import { AdCreative, AdFormat, AdPlatform } from '@/types/ad.types';

interface PreviewPaneProps {
  platform: AdPlatform;
  creative: Partial<AdCreative>;
  format: AdFormat;
}

export default function PreviewPane({ platform, creative, format }: PreviewPaneProps) {
  const getPlatformSpecificUI = () => {
    switch (platform) {
      case 'meta':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-3 border-b flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="font-semibold">Your Page Name</div>
                <div className="text-xs text-gray-500">Sponsored</div>
              </div>
            </div>
            <div className="space-y-2">
              {format !== 'text' && creative.assets?.primary && (
                <div className="aspect-[1.91/1] bg-gray-100 overflow-hidden">
                  {format === 'image' ? (
                    <img
                      src={creative.assets.primary}
                      alt="Ad preview"
                      className="w-full h-full object-cover"
                    />
                  ) : format === 'video' ? (
                    <video
                      src={creative.assets.primary}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              )}
              <div className="p-3">
                <h4 className="font-semibold line-clamp-2">{creative.title || 'Your Ad Title'}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {creative.description || 'Your ad description will appear here. Make it compelling!'}
                </p>
                <button className="mt-2 text-sm font-semibold text-blue-600">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        );

      case 'google-ads':
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-[#006621] mb-1">Ad · www.yourwebsite.com</div>
            <h4 className="text-[#1a0dab] font-medium">
              {creative.title || 'Your Ad Title'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {creative.description || 'Your ad description will appear here. Make it compelling!'}
            </p>
            {format !== 'text' && creative.assets?.primary && (
              <div className="mt-2 aspect-[1.91/1] max-h-32 bg-gray-100 overflow-hidden rounded">
                {format === 'image' ? (
                  <img
                    src={creative.assets.primary}
                    alt="Ad preview"
                    className="w-full h-full object-cover"
                  />
                ) : format === 'video' ? (
                  <video
                    src={creative.assets.primary}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-3 border-b flex items-center space-x-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div>
                <div className="font-semibold">Your Company Name</div>
                <div className="text-xs text-gray-500">Sponsored · Promoted</div>
              </div>
            </div>
            {format !== 'text' && creative.assets?.primary && (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {format === 'image' ? (
                  <img
                    src={creative.assets.primary}
                    alt="Ad preview"
                    className="w-full h-full object-cover"
                  />
                ) : format === 'video' ? (
                  <video
                    src={creative.assets.primary}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}
            <div className="p-3">
              <h4 className="font-semibold">{creative.title || 'Your Ad Title'}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {creative.description || 'Your ad description will appear here. Make it compelling!'}
              </p>
              <button className="mt-3 text-blue-600 font-semibold text-sm">
                Learn More
              </button>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-3 flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-bold">Your Account</span>
                  <span className="text-gray-500 text-sm ml-2">@youraccount</span>
                  <span className="text-gray-500 text-sm ml-2">· Promoted</span>
                </div>
                <p className="mt-1 text-gray-900">
                  {creative.description || 'Your ad description will appear here. Make it compelling!'}
                </p>
                {format !== 'text' && creative.assets?.primary && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    {format === 'image' ? (
                      <img
                        src={creative.assets.primary}
                        alt="Ad preview"
                        className="w-full h-full object-cover"
                      />
                    ) : format === 'video' ? (
                      <video
                        src={creative.assets.primary}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        {getPlatformSpecificUI()}
      </div>
      <div className="text-sm text-gray-500 text-center">
        Preview may differ from actual ad appearance
      </div>
    </div>
  );
} 